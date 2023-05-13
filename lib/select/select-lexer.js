import Lexer from '../lexer.js';

export default class SelectLexer {
  constructor(verbose) {
    this.verbose = verbose;
  }

  tokenize(expression) {
    const tokens = [];
    let current = 0;
    while (current < expression.length) {
      let char = expression[current];
      if (Lexer.isWhiteSpace(char)) {
        current++;
        continue;
      }
      if (Lexer.isAsterisk(char)) {
        tokens.push({
          type: 'asterisk',
          value: '*',
        });
        current++;
        continue;
      }
      if (Lexer.isComma(char)) {
        tokens.push({
          type: 'comma',
          value: ',',
        });
        current++;
        continue;
      }
      if (Lexer.isParenthesis(char)) {
        tokens.push({
          type: 'parenthesis',
          value: char,
        });
        current++;
        continue;
      }
      if (Lexer.isBracket(char)) {
        tokens.push({
          type: 'bracket',
          value: char,
        });
        current++;
        continue;
      }
      if (Lexer.isQuote(char)) {
        let value = '';
        char = expression[++current];
        while (!!char && !Lexer.isQuote(char)) {
          value += char;
          char = expression[++current];
        }
        tokens.push({
          type: 'identifier',
          value,
        });
        current++;
        continue;
      }
      if (Lexer.isAlphaNumeric(char) || Lexer.isSpecialChar(char)) {
        let value = '';
        while (!!char && Lexer.isAlphaNumeric(char) || Lexer.isSpecialChar(char)) {
          value += char;
          char = expression[++current];
        }
        if (['AS', 'DISTINCT', 'SUM', 'COUNT', 'AVG', 'MIN', 'MAX'].includes(value.toUpperCase())) {
          tokens.push({
            type: 'reserved_word',
            value: value.toUpperCase(),
          });
          continue;
        } else {
          tokens.push({
            type: 'identifier',
            value,
          });
          continue;
        }
      }
      throw new TypeError(`Error: SELECT expression contains invalid character: ${char}`);
    }
    return tokens;
  }
}