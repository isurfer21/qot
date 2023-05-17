import { describe, expect, test } from '@jest/globals';
import SelectAST from '../../../lib/select/select-ast';

describe('Select AST', () => {
  // Create a new instance of SelectAST
  const selectAST = new SelectAST();

  // Define some test cases with input and expected output for the generateAst method
  const generateAstTestCases = [
    {
      input: 'col1, col2, col3',
      output: {
        columns: [
          { column: 'col1', type: 'column' },
          { column: 'col2', type: 'column' },
          { column: 'col3', type: 'column' }
        ],
        type: 'select'
      }
    },
    {
      input: 'count(col1), sum(col2), avg(col3), min(col4), max(col5)',
      output: {
        columns: [
          { column: 'col1', method: 'COUNT', type: 'aggregate_function' },
          { column: 'col2', method: 'SUM', type: 'aggregate_function' },
          { column: 'col3', method: 'AVG', type: 'aggregate_function' },
          { column: 'col4', method: 'MIN', type: 'aggregate_function' },
          { column: 'col5', method: 'MAX', type: 'aggregate_function' }
        ],
        type: 'select'
      }
    },
    {
      input: 'col1 as `Col I`, sum(col2) as total, distinct col3',
      output: {
        columns: [
          { alias: 'Col I', column: 'col1', type: 'column' },
          { alias: 'total', column: 'col2', method: 'SUM', type: 'aggregate_function' },
          { column: 'col3', type: 'distinct' }
        ],
        type: 'select'
      }
    }
  ];

  // Write a test for each test case using the test() function
  generateAstTestCases.forEach(testCase => {
    test(`generateAst '${testCase.input}'`, () => {
      // Call the generateAst method with the input
      const ast = selectAST.generateAst(testCase.input);
      // Expect the ast to match the output
      expect(ast).toEqual(testCase.output);
    });
  });

  // Define some test cases with input and expected output for the toColumns method
  const toColumnsTestCases = [
    {
      input: {
        columns: [
          { alias: 'Col I', column: 'col1', type: 'column' },
          { alias: 'total', column: 'col2', method: 'SUM', type: 'aggregate_function' },
          { column: 'col3', type: 'distinct' }
        ],
        type: 'select'
      },
      output: { col1: 'Col I', col2: 'total', col3: 'col3' }
    },
    {
      input: {
        columns: [
          { column: 'col1', method: 'COUNT', type: 'aggregate_function' },
          { column: 'col2', method: 'SUM', type: 'aggregate_function', alias: 'total' },
          { column: 'col3', method: 'AVG', type: 'aggregate_function' },
          { column: 'col4', method: 'MIN', type: 'aggregate_function' },
          { column: 'col5', method: 'MAX', type: 'aggregate_function' }
        ],
        type: 'select'
      },
      output: {
        col1: 'COUNT(col1)',
        col2: 'total',
        col3: 'AVG(col3)',
        col4: 'MIN(col4)',
        col5: 'MAX(col5)'
      }
    }
  ];

  // Write a test for each test case using the test() function
  toColumnsTestCases.forEach(testCase => {
    test(`toColumns '${testCase.input}'`, () => {
      // Call the toColumns method with the input
      const jsc = selectAST.toColumns(testCase.input);
      // Expect the jsc to match the output
      expect(jsc).toEqual(testCase.output);
    });
  });

  // Define some test cases with input and expected output for the aggregators method
  const aggregatorsTestCases = [
    {
      input: {
        columns: [
          { column: 'col1', method: 'COUNT', type: 'aggregate_function' },
          { column: 'col2', method: 'SUM', type: 'aggregate_function' },
          { column: 'col3', method: 'AVG', type: 'aggregate_function' },
          { column: 'col4', method: 'MIN', type: 'aggregate_function' },
          { column: 'col5', method: 'MAX', type: 'aggregate_function' }
        ],
        type: 'select'
      },
      output: {
        col1: 'COUNT',
        col2: 'SUM',
        col3: 'AVG',
        col4: 'MIN',
        col5: 'MAX'
      }
    }
  ];

  // Write a test for each test case using the test() function
  aggregatorsTestCases.forEach(testCase => {
    test(`aggregators '${testCase.input}'`, () => {
      // Call the aggregators method with the input
      const jsc = selectAST.aggregators(testCase.input);
      // Expect the jsc to match the output
      expect(jsc).toEqual(testCase.output);
    });
  });

});
