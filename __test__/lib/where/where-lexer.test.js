import {describe, expect, test, beforeEach} from '@jest/globals';
import WhereLexer from '../../../lib/where/where-lexer';

// Define a test suite for the WhereLexer class
describe('WhereLexer', () => {
  // Declare a variable to hold the instance of WhereLexer
  let whereLexer;

  // Use beforeEach to create a new instance of WhereLexer before each test
  beforeEach(() => {
    whereLexer = new WhereLexer();
  });

  // Define some test cases with input and expected output
  const testCases = [
    {
      input: 'name = "John"',
      output: ['name', '=', '"John"']
    },
    {
      input: 'age >= 18 and gender != "F"',
      output: ['age', '>=', '18', 'and', 'gender', '!=', '"F"']
    },
    {
      input: '(city = "New York" or city = "London") and country in ("USA", "UK")',
      output: ['(', 'city', '=', '"New York"', 'or', 'city', '=', '"London"', ')', 'and', 'country', 'in', '(', '"USA"', ',', '"UK"', ')']
    },
    {
      input: 'country <> "USA"',
      output: ['country', '<>', '"USA"']
    },
    {
      input: 'price NOT BETWEEN 10 AND 20',
      output: ['price', 'NOT', 'BETWEEN', '10', 'AND', '20']
    },
    {
      input: 'order_date NOT IN ("2021-01-01", "2021-01-31")',
      output: ['order_date', 'NOT', 'IN', '(', '"2021-01-01"', ',', '"2021-01-31"', ')']
    },
    {
      input: 'name NOT LIKE "John%"',
      output: ['name', 'NOT', 'LIKE', '"John%"']
    },
    {
      input: 'genre IS NOT NULL',
      output: ['genre', 'IS', 'NOT', 'NULL']
    },
    {
      input: 'invalid expression',
      output: ['invalid', 'expression']
    }
  ];

  // Write a test for each test case using the test() function
  testCases.forEach(testCase => {
    test(`tokenize "${testCase.input}"`, () => {
      // Call the tokenize method with the input
      const tokens = whereLexer.tokenize(testCase.input);
      // Expect the tokens to match the output
      expect(tokens).toEqual(testCase.output);
    });
  });
});
