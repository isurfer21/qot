import { describe, expect, test } from '@jest/globals';
import SelectClause from '../../../lib/select/select-clause';

describe('SelectClause', () => {
  test('process should parse the select statement and extract the columns, aggregates and filters', () => {
    let selectClause = new SelectClause(false, [
      { name: 'Alice', age: 20, salary: 1000 },
      { name: 'Bob', age: 21, salary: 2000 },
      { name: 'Charlie', age: 23, salary: 3000 }
    ]);
    selectClause.process('name AS "Employee Name", AVG(age) AS "Average Age", DISTINCT salary');
    expect(selectClause.columns).toEqual({ age: 'Average Age', name: 'Employee Name', salary: 'salary' });
    expect(selectClause.aggregates).toEqual({ age: 'AVG' });
    expect(selectClause.filters).toEqual({ salary: 'distinct' });
  });

  test('process should handle wildcard and distinct keywords in the select statement', () => {
    let selectClause = new SelectClause(false, [
      { name: 'Alice', age: 20, salary: 1000 },
      { name: 'Bob', age: 21, salary: 2000 },
      { name: 'Charlie', age: 23, salary: 3000 }
    ]);
    selectClause.process('*');
    expect(selectClause.columns).toEqual({ age: 'age', name: 'name', salary: 'salary' });
    expect(selectClause.aggregates).toEqual({});
    expect(selectClause.filters).toEqual({});

    selectClause.process('DISTINCT name');
    expect(selectClause.columns).toEqual({ name: 'name' });
    expect(selectClause.aggregates).toEqual({});
    expect(selectClause.filters).toEqual({ name: 'distinct' });
  });

  test('process should exit with an error if the select statement contains invalid columns', () => {
    let selectClause = new SelectClause(false, [
      { name: 'Alice', age: 20, salary: 1000 },
      { name: 'Bob', age: 21, salary: 2000 },
      { name: 'Charlie', age: 23, salary: 3000 }
    ]);

    // Mock the console.error and process.exit methods
    console.error = jest.fn();
    process.exit = jest.fn();

    selectClause.process('foo AS "Bar", SUM(baz) AS "Baz"');

    // Expect the console.error to be called with the invalid columns
    expect(console.error).toHaveBeenCalledWith("Error: 'foo, baz' are invalid columns.");

    // Expect the process.exit to be called with code 1
    expect(process.exit).toHaveBeenCalledWith(1);
  });
});
