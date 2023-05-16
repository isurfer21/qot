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
        right: {
          type: 'BinaryExpression',
          operator: '!=',
          left: { type: 'Literal', value: 'gender' },
          right: { type: 'Literal', value: 'F' }
        }
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
      input: ['country', '<>', '"USA"'],
      output: {
        type: 'BinaryExpression',
        operator: '<>',
        left: { type: 'Literal', value: 'country' },
        right: { type: 'Literal', value: 'USA' }
      }
    },
    {
      input: ['price', 'NOT', 'BETWEEN', '10', 'AND', '20'],
      output: {
        type: 'NotBetweenExpression',
        left: { type: 'Literal', value: 'price' },
        min: { type: 'Literal', value: 10 },
        max: { type: 'Literal', value: 20 }
      }
    },
    {
      input: ['order_date', 'NOT', 'IN', '(', '"2021-01-01"', ',', '"2021-01-31"', ')'],
      output: {
        type: 'NotInExpression',
        left: { type: 'Literal', value: 'order_date' },
        values: [
          { type: 'Literal', value: '2021-01-01' },
          { type: 'Literal', value: '2021-01-31' }
        ]
      }
    },
    {
      input: ['name', 'NOT', 'LIKE', '"John%"'],
      output: {
        type: 'NotLikeExpression',
        left: { type: 'Literal', value: 'name' },
        right: { type: 'Literal', value: 'John%' }
      }
    },
    {
      input: ['genre', 'IS', 'NOT', 'NULL'],
      output: {
        type: 'IsExpression',
        operator: 'IS NOT',
        left: { type: 'Literal', value: 'genre' },
        right: { type: 'Literal', value: null }
      }
    },
    {
      input: ['NOT', 'salary', '<', '5000'],
      output: {
        type: 'NotExpression',
        argument: {
          type: 'BinaryExpression',
          operator: '<',
          left: { type: 'Literal', value: 'salary' },
          right: { type: 'Literal', value: 5000 }
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

  // Define some test cases with input and expected output for the capitalizeReservedWords method
  const capitalizeReservedWordsTestCases = [
    {
      input: ['age', '>=', '18', 'and', 'gender', '<>', '"F"'],
      output: ['age', '>=', '18', 'AND', 'gender', '<>', '"F"']
    },
    {
      input: ['age', '>=', '21', 'or', 'gender', '=', '"M"'],
      output: ['age', '>=', '21', 'OR', 'gender', '=', '"M"']
    },
    {
      input: ['price', 'not', 'between', '10', 'and', '20'],
      output: ['price', 'NOT', 'BETWEEN', '10', 'AND', '20']
    }
  ];

  // Write a test for each test case using the test() function
  capitalizeReservedWordsTestCases.forEach(testCase => {
    test(`capitalizeReservedWords '${testCase.input}'`, () => {
      // Call the parseExpression method with the input
      const ast = whereParser.capitalizeReservedWords(testCase.input);
      // Expect the ast to match the output
      expect(ast).toEqual(testCase.output);
    });
  });

  // Define some test cases with input and expected output for the parseExpression method
  const parseExpressionTestCases = [
    {
      input: ['age', '>=', '18', 'AND', 'gender', '<>', '"F"'],
      output: {
        type: 'LogicalExpression',
        operator: 'AND',
        left: {
          type: 'BinaryExpression',
          operator: '>=',
          left: { type: 'Literal', value: 'age' },
          right: { type: 'Literal', value: 18 }
        },
        right: {
          type: 'BinaryExpression',
          operator: '<>',
          left: { type: 'Literal', value: 'gender' },
          right: { type: 'Literal', value: 'F' }
        }
      }
    },
    {
      input: ['age', '>=', '21', 'OR', 'gender', '=', '"M"'],
      output: {
        type: 'LogicalExpression',
        operator: 'OR',
        left: {
          type: 'BinaryExpression',
          operator: '>=',
          left: { type: 'Literal', value: 'age' },
          right: { type: 'Literal', value: 21 }
        },
        right: {
          type: 'BinaryExpression',
          operator: '=',
          left: { type: 'Literal', value: 'gender' },
          right: { type: 'Literal', value: 'M' }
        }
      }
    },
    {
      input: ['price', 'NOT', 'BETWEEN', '10', 'AND', '20'],
      output: {
        type: 'NotBetweenExpression',
        left: { type: 'Literal', value: 'price' },
        min: { type: 'Literal', value: 10 },
        max: { type: 'Literal', value: 20 }
      }
    }
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
      input: ['country', '<>', '"USA"'],
      output: {
        type: 'BinaryExpression',
        operator: '<>',
        left: { type: 'Literal', value: 'country' },
        right: { type: 'Literal', value: 'USA' }
      }
    },
    {
      input: ['NOT', 'salary', '<', '5000'],
      output: {
        type: 'NotExpression',
        argument: {
          type: 'BinaryExpression',
          operator: '<',
          left: { type: 'Literal', value: 'salary' },
          right: { type: 'Literal', value: 5000 }
        }
      }
    }
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