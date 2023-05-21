import { describe, expect, test, beforeEach } from '@jest/globals';
import SelectParser from '../../../lib/select/select-parser';

describe('Select Parser', () => {
  let parser;

  beforeEach(() => {
    parser = new SelectParser();
  });

  test('parser returns an empty array for an empty expression', () => {
    const expression = '';
    const expectedTokens = { columns: [], type: 'select' };
    expect(parser.parse(expression)).toEqual(expectedTokens);
  });

  test('parser returns an array of tokens for a valid expression with asterisk', () => {
    const expression = [{ type: 'asterisk', value: '*' }];
    const expectedTokens = { columns: [{ column: '*', type: 'column' }], type: 'select' };
    expect(parser.parse(expression)).toEqual(expectedTokens);
  });

  test('parser expression of columns separated by comma', () => {
    const expression = [
      { type: 'identifier', value: 'col1' },
      { type: 'comma', value: ',' },
      { type: 'identifier', value: 'col2' },
      { type: 'comma', value: ',' },
      { type: 'identifier', value: 'col3' }
    ];
    const expectedTokens = {
      columns: [
        { column: 'col1', type: 'column' },
        { column: 'col2', type: 'column' },
        { column: 'col3', type: 'column' }
      ],
      type: 'select'
    };
    expect(parser.parse(expression)).toEqual(expectedTokens);
  });

  test('parser expression of columns separated by comma followed by space', () => {
    const expression = [
      { type: 'identifier', value: 'col1' },
      { type: 'comma', value: ',' },
      { type: 'identifier', value: 'col2' },
      { type: 'comma', value: ',' },
      { type: 'identifier', value: 'col3' }
    ];
    const expectedTokens = {
      columns: [
        { column: 'col1', type: 'column' },
        { column: 'col2', type: 'column' },
        { column: 'col3', type: 'column' }
      ],
      type: 'select'
    };
    expect(parser.parse(expression)).toEqual(expectedTokens);
  });

  test('parser expression of columns having special characters', () => {
    const expression = [
      { type: 'identifier', value: 'col_1' },
      { type: 'comma', value: ',' },
      { type: 'identifier', value: 'col-2' },
      { type: 'comma', value: ',' },
      { type: 'identifier', value: 'col3%' }
    ];
    const expectedTokens = {
      columns: [
        { column: 'col_1', type: 'column' },
        { column: 'col-2', type: 'column' },
        { column: 'col3%', type: 'column' }
      ],
      type: 'select'
    };
    expect(parser.parse(expression)).toEqual(expectedTokens);
  });

  test('parser expression of columns enclosed in aggregators', () => {
    const expression = [
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
    const expectedTokens = {
      columns: [
        { column: 'col1', method: 'COUNT', type: 'aggregate_function' },
        { column: 'col2', method: 'SUM', type: 'aggregate_function' },
        { column: 'col3', method: 'AVG', type: 'aggregate_function' },
        { column: 'col4', method: 'MIN', type: 'aggregate_function' },
        { column: 'col5', method: 'MAX', type: 'aggregate_function' }
      ],
      type: 'select'
    };
    expect(parser.parse(expression)).toEqual(expectedTokens);
  });

  test('parser expression of columns with alias', () => {
    const expression = [
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
    const expectedTokens = {
      columns: [
        { alias: 'Col I', column: 'col1', type: 'column' },
        { alias: 'total', column: 'col2', method: 'SUM', type: 'aggregate_function' },
        { column: 'col3', type: 'distinct' }
      ],
      type: 'select'
    };
    expect(parser.parse(expression)).toEqual(expectedTokens);
  });

  test('parser expression of columns with space in column-name enclosed in back-quote', () => {
    const expression = [
      { type: 'identifier', value: 'col 1' },
      { type: 'comma', value: ',' },
      { type: 'identifier', value: 'col 2' },
      { type: 'reserved_word', value: 'AS' },
      { type: 'identifier', value: 'Col II' },
      { type: 'comma', value: ',' },
      { type: 'identifier', value: 'col 3 %' }
    ];
    const expectedTokens = {
      columns: [
        { column: 'col 1', type: 'column' },
        { alias: 'Col II', column: 'col 2', type: 'column' },
        { column: 'col 3 %', type: 'column' }
      ],
      type: 'select'
    };
    expect(parser.parse(expression)).toEqual(expectedTokens);
  });

  test('parser expression of columns with space in column-name enclosed in single-quote', () => {
    const expression = [
      { type: 'identifier', value: 'col 1' },
      { type: 'comma', value: ',' },
      { type: 'identifier', value: 'col 2' },
      { type: 'reserved_word', value: 'AS' },
      { type: 'identifier', value: 'Col II' },
      { type: 'comma', value: ',' },
      { type: 'identifier', value: 'col 3 %' }
    ];
    const expectedTokens = {
      columns: [
        { column: 'col 1', type: 'column' },
        { alias: 'Col II', column: 'col 2', type: 'column' },
        { column: 'col 3 %', type: 'column' }
      ],
      type: 'select'
    };
    expect(parser.parse(expression)).toEqual(expectedTokens);
  });
});
