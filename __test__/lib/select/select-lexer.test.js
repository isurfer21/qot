import { describe, expect, test, beforeEach } from '@jest/globals';
import SelectLexer from '../../../lib/select/select-lexer';

describe('Select Lexer', () => {
  let lexer;

  beforeEach(() => {
    lexer = new SelectLexer();
  });

  test('tokenize returns an empty array for an empty expression', () => {
    expect(lexer.tokenize('')).toEqual([]);
  });

  test('tokenize returns an array of tokens for a valid expression with asterisk', () => {
    const expression = '*';
    const expectedTokens = [{ type: 'asterisk', value: '*' }];
    expect(lexer.tokenize(expression)).toEqual(expectedTokens);
  });

  test('tokenize throws an error for an invalid expression', () => {
    const expression = 'col1;col2.col3';
    expect(() => lexer.tokenize(expression)).toThrow(TypeError);
  });

  test('tokenize expression of columns separated by comma', () => {
    const expression = 'col1,col2,col3';
    const expectedTokens = [
      { type: 'identifier', value: 'col1' },
      { type: 'comma', value: ',' },
      { type: 'identifier', value: 'col2' },
      { type: 'comma', value: ',' },
      { type: 'identifier', value: 'col3' }
    ];
    expect(lexer.tokenize(expression)).toEqual(expectedTokens);
  });

  test('tokenize expression of columns separated by comma followed by space', () => {
    const expression = 'col1, col2, col3';
    const expectedTokens = [
      { type: 'identifier', value: 'col1' },
      { type: 'comma', value: ',' },
      { type: 'identifier', value: 'col2' },
      { type: 'comma', value: ',' },
      { type: 'identifier', value: 'col3' }
    ];
    expect(lexer.tokenize(expression)).toEqual(expectedTokens);
  });

  test('tokenize expression of columns having special characters', () => {
    const expression = 'col_1, col-2, col3%';
    const expectedTokens = [
      { type: 'identifier', value: 'col_1' },
      { type: 'comma', value: ',' },
      { type: 'identifier', value: 'col-2' },
      { type: 'comma', value: ',' },
      { type: 'identifier', value: 'col3%' }
    ];
    expect(lexer.tokenize(expression)).toEqual(expectedTokens);
  });

  test('tokenize expression of columns enclosed in aggregators', () => {
    const expression = 'count(col1), sum(col2), avg(col3), min(col4), max(col5)';
    const expectedTokens = [
      { type: 'reserved_word', value: 'COUNT' },
      { type: 'parenthesis', value: '(' },
      { type: 'identifier', value: 'col1' },
      { type: 'parenthesis', value: ')' },
      { type: 'comma', value: ',' },
      { type: 'reserved_word', value: 'SUM' },
      { type: 'parenthesis', value: '(' },
      { type: 'identifier', value: 'col2' },
      { type: 'parenthesis', value: ')' },
      { type: 'comma', value: ',' },
      { type: 'reserved_word', value: 'AVG' },
      { type: 'parenthesis', value: '(' },
      { type: 'identifier', value: 'col3' },
      { type: 'parenthesis', value: ')' },
      { type: 'comma', value: ',' },
      { type: 'reserved_word', value: 'MIN' },
      { type: 'parenthesis', value: '(' },
      { type: 'identifier', value: 'col4' },
      { type: 'parenthesis', value: ')' },
      { type: 'comma', value: ',' },
      { type: 'reserved_word', value: 'MAX' },
      { type: 'parenthesis', value: '(' },
      { type: 'identifier', value: 'col5' },
      { type: 'parenthesis', value: ')' }
    ];
    expect(lexer.tokenize(expression)).toEqual(expectedTokens);
  });

  test('tokenize expression of columns with alias', () => {
    const expression = 'col1 as `Col I`, sum(col2) as total, distinct col3';
    const expectedTokens = [
      { type: 'identifier', value: 'col1' },
      { type: 'reserved_word', value: 'AS' },
      { type: 'identifier', value: 'Col I' },
      { type: 'comma', value: ',' },
      { type: 'reserved_word', value: 'SUM' },
      { type: 'parenthesis', value: '(' },
      { type: 'identifier', value: 'col2' },
      { type: 'parenthesis', value: ')' },
      { type: 'reserved_word', value: 'AS' },
      { type: 'identifier', value: 'total' },
      { type: 'comma', value: ',' },
      { type: 'reserved_word', value: 'DISTINCT' },
      { type: 'identifier', value: 'col3' }
    ];
    expect(lexer.tokenize(expression)).toEqual(expectedTokens);
  });

  test('tokenize expression of columns with space in column-name enclosed in back-quote', () => {
    const expression = '`col 1`, `col 2` as `Col II`, `col 3 %`';
    const expectedTokens = [
      { type: 'identifier', value: 'col 1' },
      { type: 'comma', value: ',' },
      { type: 'identifier', value: 'col 2' },
      { type: 'reserved_word', value: 'AS' },
      { type: 'identifier', value: 'Col II' },
      { type: 'comma', value: ',' },
      { type: 'identifier', value: 'col 3 %' }
    ];
    expect(lexer.tokenize(expression)).toEqual(expectedTokens);
  });

  test('tokenize expression of columns with space in column-name enclosed in single-quote', () => {
    const expression = "'col 1', 'col 2' as 'Col II', 'col 3 %'";
    const expectedTokens = [
      { type: 'identifier', value: 'col 1' },
      { type: 'comma', value: ',' },
      { type: 'identifier', value: 'col 2' },
      { type: 'reserved_word', value: 'AS' },
      { type: 'identifier', value: 'Col II' },
      { type: 'comma', value: ',' },
      { type: 'identifier', value: 'col 3 %' }
    ];
    expect(lexer.tokenize(expression)).toEqual(expectedTokens);
  });
});