export default class WhereLexer {
  constructor(verbose) {
    this.verbose = verbose;
  }

  tokenize(expression) {
    const tokens = [];
    let currentToken = '';
    let inString = false;
    let stringChar = '';

    for (let i = 0; i < expression.length; i++) {
      const char = expression[i];

      if (inString) {
        currentToken += char;
        if (char === stringChar) {
          inString = false;
          stringChar = '';
          tokens.push(currentToken);
          currentToken = '';
        }
      } else if (char === ' ') {
        if (currentToken.length > 0) {
          tokens.push(currentToken);
          currentToken = '';
        }
      } else if (['=', '<', '>', '!'].includes(char)) {
        if (currentToken.length > 0) {
          tokens.push(currentToken);
          currentToken = '';
        }
        currentToken += char;
        if (
          ['<>', '>=', '<=', '!='].includes(
            expression.substring(i, i + 2)
          )
        ) {
          currentToken += expression[i + 1];
          i++;
        }
        tokens.push(currentToken);
        currentToken = '';
      } else if (char === '(' || char === ')') {
        if (currentToken.length > 0) {
          tokens.push(currentToken);
          currentToken = '';
        }
        tokens.push(char);
      } else if (char === ',') {
        if (currentToken.length > 0) {
          tokens.push(currentToken);
          currentToken = '';
        }
        tokens.push(char);
      } else if (char === "'" || char === '"' || char === '`') {
        inString = true;
        stringChar = char;
        currentToken += char;
      } else {
        currentToken += char;
      }
    }

    if (currentToken.length > 0) {
      tokens.push(currentToken);
    }

    return tokens;
  }
}