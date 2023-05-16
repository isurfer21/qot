import { describe, expect, test } from '@jest/globals';
import WhereParser from '../../../lib/where/where-parser';

describe('Where Parser', () => {

  // Create a new instance of WhereParser
  const whereParser = new WhereParser();

  // Define some test cases with input and expected output for the parse method
  const parseTestCases = [
    {
      input: ['name', '=', '"John"'],
      output: {
        type: 'BinaryExpression',
        operator: '=',
        left: { type: 'Literal', value: 'name' },
        right: { type: 'Literal', value: 'John' }
      }
    },
    {
      input: ['age', '>=', '18', 'and', 'gender', '!=', '"F"'],
      output: {
        type: 'LogicalExpression',
        operator: 'AND',
        left: {
          type: 'BinaryExpression',
          operator: '>=',
          left: { type: 'Literal', value: 'age' },
          right: { type: 'Literal', value: 18 }
        },
        right: { type: 'Literal', value: 'gender' }
      }
    },
    {
      input: ['(', 'city', '=', '"New York"', 'or', 'city', '=', '"London"', ')', 'and', 'country', 'in', '(', '"USA"', ',', '"UK"', ')'],
      output: {
        type: 'LogicalExpression',
        operator: 'AND',
        left: {
          type: 'LogicalExpression',
          operator: 'OR',
          left: {
            type: 'BinaryExpression',
            operator: '=',
            left: { type: 'Literal', value: 'city' },
            right: { type: 'Literal', value: 'New York' }
          },
          right: {
            type: 'BinaryExpression',
            operator: '=',
            left: { type: 'Literal', value: 'city' },
            right: { type: 'Literal', value: 'London' }
          }
        },
        right: {
          type: 'InExpression',
          left: { type: 'Literal', value: 'country' },
          values: [
            { type: 'Literal', value: 'USA' },
            { type: 'Literal', value: 'UK' }
          ]
        }
      }
    },
    {
      input: ['invalid', 'expression'],
      output: { type: 'Literal', value: 'invalid' }
    }
  ];

  // Write a test for each test case using the test() function
  parseTestCases.forEach(testCase => {
    test(`parse '${testCase.input}'`, () => {
      // Call the parse method with the input
      const ast = whereParser.parse(testCase.input);
      // Expect the ast to match the output
      expect(ast).toEqual(testCase.output);
    });
  });

  // Define some test cases with input and expected output for the parseExpression method
  const parseExpressionTestCases = [
    // Same as parseTestCases
  ];

  // Write a test for each test case using the test() function
  parseExpressionTestCases.forEach(testCase => {
    test(`parseExpression '${testCase.input}'`, () => {
      // Call the parseExpression method with the input
      const ast = whereParser.parseExpression(testCase.input);
      // Expect the ast to match the output
      expect(ast).toEqual(testCase.output);
    });
  });

  // Define some test cases with input and expected output for the parseCondition method
  const parseConditionTestCases = [
    // Same as parseTestCases
  ];

  // Write a test for each test case using the test() function
  parseConditionTestCases.forEach(testCase => {
    test(`parseCondition '${testCase.input}'`, () => {
      // Call the parseCondition method with the input
      const ast = whereParser.parseCondition(testCase.input);
      // Expect the ast to match the output
      expect(ast).toEqual(testCase.output);
    });
  });

  // Define some test cases with input and expected output for the parseValue method
  const parseValueTestCases = [
    {
      input: ['"John"'],
      output: { type: 'Literal', value: 'John' }
    },
    {
      input: ['18'],
      output: { type: 'Literal', value: 18 }
    },
    {
      input: ['2021-01-01'],
      output: { type: 'Literal', value: new Date('2021-01-01') }
    },
    {
      input: ['NULL'],
      output: { type: 'Literal', value: null }
    },
    {
      input: ['name'],
      output: { type: 'Literal', value: 'name' }
    }
  ];

  // Write a test for each test case using the test() function
  parseValueTestCases.forEach(testCase => {
    test(`parseValue '${testCase.input}'`, () => {
      // Call the parseValue method with the input
      const ast = whereParser.parseValue(testCase.input);
      // Expect the ast to match the output
      expect(ast).toEqual(testCase.output);
    });
  });

});