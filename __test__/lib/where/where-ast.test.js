import { jest, describe, expect, test } from '@jest/globals';
import WhereAST from '../../../lib/where/where-ast';

describe('Where AST', () => {
  // Create a new instance of WhereAST
  const whereAST = new WhereAST();
  
  test('process should exit with an warning if the where condition is empty', () => {
    // Mock the console.warn methods
    console.warn = jest.fn();
    // Pass empty expression
    whereAST.generateAst('');
    // Expect the console.error to be called with the invalid columns
    expect(console.warn).toHaveBeenCalledWith("Error: Missing or invalid WHERE expression!");
  });

  // Define some test cases with input and expected output for the generateAst method
  const generateAstTestCases = [
    {
      input: 'age >= 18 and gender != "F"',
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
      input: '(city = "New York" or city = "London") and country in ("USA", "UK")',
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
      input: 'price NOT BETWEEN 10 AND 20',
      output: {
        type: 'NotBetweenExpression',
        left: { type: 'Literal', value: 'price' },
        min: { type: 'Literal', value: 10 },
        max: { type: 'Literal', value: 20 }
      }
    }
  ];

  // Write a test for each test case using the test() function
  generateAstTestCases.forEach(testCase => {
    test(`generateAst '${testCase.input}'`, () => {
      // Call the generateAst method with the input
      const ast = whereAST.generateAst(testCase.input);
      // Expect the ast to match the output
      expect(ast).toEqual(testCase.output);
    });
  });

  // Define some test cases with input and expected output for the recreateExpression method
  const recreateExpressionTestCases = [
    {
      input: {
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
      },
      output: '("age" >= 18 AND "gender" != "F")'
    }
  ];

  // Write a test for each test case using the test() function
  recreateExpressionTestCases.forEach(testCase => {
    test(`recreateExpression '${testCase.input}'`, () => {
      // Call the recreateExpression method with the input
      const expr = whereAST.recreateExpression(testCase.input);
      // Expect the expr to match the output
      expect(expr).toEqual(testCase.output);
    });
  });

  // Define some test cases with input and expected output for the toJavaScript method
  const toJavaScriptTestCases = [
    {
      input: {
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
      },
      output: '(row["age"] >= 18 && row["gender"] != "F")'
    }
  ];

  // Write a test for each test case using the test() function
  toJavaScriptTestCases.forEach(testCase => {
    test(`toJavaScript '${testCase.input}'`, () => {
      // Call the toJavaScript method with the input
      const jsc = whereAST.toJavaScript(testCase.input);
      // Expect the jsc to match the output
      expect(jsc).toEqual(testCase.output);
    });
  });
});