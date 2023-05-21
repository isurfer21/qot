import { describe, expect, test } from '@jest/globals';
import Lexer from '../../lib/lexer';

describe('Select Lexer', () => {
  test('isAlphaNumeric returns true for alphanumeric characters', () => {
    expect(Lexer.isAlphaNumeric('a')).toBe(true);
    expect(Lexer.isAlphaNumeric('Z')).toBe(true);
    expect(Lexer.isAlphaNumeric('5')).toBe(true);
  });

  test('isAlphaNumeric returns false for non-alphanumeric characters', () => {
    expect(Lexer.isAlphaNumeric('.')).toBe(false);
    expect(Lexer.isAlphaNumeric(' ')).toBe(false);
    expect(Lexer.isAlphaNumeric('\n')).toBe(false);
  });

  test('isWhiteSpace returns true for white space characters', () => {
    expect(Lexer.isWhiteSpace(' ')).toBe(true);
    expect(Lexer.isWhiteSpace('\t')).toBe(true);
    expect(Lexer.isWhiteSpace('\n')).toBe(true);
  });

  test('isWhiteSpace returns false for non-white space characters', () => {
    expect(Lexer.isWhiteSpace('a')).toBe(false);
    expect(Lexer.isWhiteSpace('1')).toBe(false);
    expect(Lexer.isWhiteSpace('*')).toBe(false);
  });

  test('isParenthesis returns true for parenthesis characters', () => {
    expect(Lexer.isParenthesis('(')).toBe(true);
    expect(Lexer.isParenthesis(')')).toBe(true);
  });

  test('isParenthesis returns false for non-parenthesis characters', () => {
    expect(Lexer.isParenthesis('[')).toBe(false);
    expect(Lexer.isParenthesis(']')).toBe(false);
    expect(Lexer.isParenthesis('{')).toBe(false);
    expect(Lexer.isParenthesis('}')).toBe(false);
  });

  test('isBracket returns true for bracket characters', () => {
    expect(Lexer.isBracket('[')).toBe(true);
    expect(Lexer.isBracket(']')).toBe(true);
  });

  test('isBracket returns false for non-bracket characters', () => {
    expect(Lexer.isBracket('(')).toBe(false);
    expect(Lexer.isBracket(')')).toBe(false);
    expect(Lexer.isBracket('{')).toBe(false);
    expect(Lexer.isBracket('}')).toBe(false);
  });

  test('isComma returns true for comma characters', () => {
    expect(Lexer.isComma(',')).toBe(true);
  });

  test('isComma returns false for non-comma characters', () => {
    expect(Lexer.isComma(';')).toBe(false);
    expect(Lexer.isComma('.')).toBe(false);
    expect(Lexer.isComma('a')).toBe(false);
  });

  test('isAsterisk returns true for asterisk characters', () => {
    expect(Lexer.isAsterisk('*')).toBe(true);
  });

  test('isAsterisk returns false for non-asterisk characters', () => {
    expect(Lexer.isAsterisk('+')).toBe(false);
    expect(Lexer.isAsterisk('-')).toBe(false);
    expect(Lexer.isAsterisk('a')).toBe(false);
  });

  test('isQuote returns true for quote characters', () => {
    expect(Lexer.isQuote('\'')).toBe(true);
    expect(Lexer.isQuote('\"')).toBe(true);
    expect(Lexer.isQuote('`')).toBe(true);
  });

  test('isQuote returns false for non-quote characters', () => {
    expect(Lexer.isQuote('.')).toBe(false);
    expect(Lexer.isQuote(',')).toBe(false);
    expect(Lexer.isQuote('a')).toBe(false);
  });

  test('isSpecialChar returns true for specialchar characters', () => {
    expect(Lexer.isSpecialChar('_')).toBe(true);
    expect(Lexer.isSpecialChar('@')).toBe(true);
    expect(Lexer.isSpecialChar('#')).toBe(true);
    expect(Lexer.isSpecialChar('$')).toBe(true);
  });

  test('isSpecialChar returns false for non-specialchar characters', () => {
    expect(Lexer.isSpecialChar('a')).toBe(false);
    expect(Lexer.isSpecialChar('1')).toBe(false);
    expect(Lexer.isSpecialChar('*')).toBe(false);
    expect(Lexer.isSpecialChar('%')).toBe(false);
    expect(Lexer.isSpecialChar('-')).toBe(false);
  });

  test('isWildcardChar returns true for wildcard characters', () => {
    expect(Lexer.isWildcardChar('%')).toBe(true);
    expect(Lexer.isWildcardChar('*')).toBe(true);
  });

  test('isWildcardChar returns false for non-wildcard characters', () => {
    expect(Lexer.isWildcardChar('a')).toBe(false);
    expect(Lexer.isWildcardChar('1')).toBe(false);
    expect(Lexer.isWildcardChar('#')).toBe(false);
    expect(Lexer.isWildcardChar('$')).toBe(false);
  });

});