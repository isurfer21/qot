import { describe, expect, test } from '@jest/globals';
import WhereClause from '../../../lib/where/where-clause';

describe('WhereClause', () => {
  test('process should filter the rows based on the where condition', () => {
    let whereClause = new WhereClause(false, [
      { name: 'Alice', age: 20, salary: 1000 },
      { name: 'Bob', age: 21, salary: 2000 },
      { name: 'Charlie', age: 23, salary: 3000 }
    ]);
    whereClause.process('age > 20');
    expect(whereClause.filteredRows).toEqual([
      { name: 'Bob', age: 21, salary: 2000 },
      { name: 'Charlie', age: 23, salary: 3000 }
    ]);
  });

  test('process should handle complex where conditions with logical operators', () => {
    let whereClause = new WhereClause(false, [
      { name: 'Alice', age: 20, salary: 1000 },
      { name: 'Bob', age: 21, salary: 2000 },
      { name: 'Charlie', age: 23, salary: 3000 }
    ]);
    whereClause.process('(age > 20 AND salary < 3000) OR name = "Alice"');
    expect(whereClause.filteredRows).toEqual([
      { name: 'Alice', age: 20, salary: 1000 },
      { name: 'Bob', age: 21, salary: 2000 }
    ]);
  });

  test('process should handle where conditions with string literals and comparison operators', () => {
    let whereClause = new WhereClause(false, [
      { name: 'Alice', age: 20, salary: 1000 },
      { name: 'Bob', age: 21, salary: 2000 },
      { name: 'Charlie', age: 23, salary: 3000 }
    ]);
    whereClause.process('name LIKE "A%"');
    expect(whereClause.filteredRows).toEqual([{ name: 'Alice', age: 20, salary: 1000 }]);
  });

  test('process should return all rows if the where condition is empty or invalid', () => {
    let whereClause = new WhereClause(false, [
      { name: 'Alice', age: 20, salary: 1000 },
      { name: 'Bob', age: 21, salary: 2000 },
      { name: 'Charlie', age: 23, salary: 3000 }
    ]);
    whereClause.process('foo bar');
    expect(whereClause.filteredRows).toEqual([
      { name: 'Alice', age: 20, salary: 1000 },
      { name: 'Bob', age: 21, salary: 2000 },
      { name: 'Charlie', age: 23, salary: 3000 }
    ]);
  });
});
