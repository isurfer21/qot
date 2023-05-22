import { describe, expect, test } from '@jest/globals';
import OrderBy from '../../lib/orderby';

describe('OrderBy', () => {
  const sampleTable = [
    { name: 'Alice', age: 25 },
    { name: 'Dan', age: 30 },
    { name: 'Charlie', age: 28 }
  ];

  test('process should sort the rows based on a column name in ascending order', () => {
    // Arrange
    const orderBy = new OrderBy(false);
    const rows = sampleTable;
    const column = 'name';
    const asc = true;
    const desc = false;
    const expected = [
      { name: 'Alice', age: 25 },
      { name: 'Charlie', age: 28 },
      { name: 'Dan', age: 30 }
    ];

    // Act
    const result = orderBy.process(rows, column, asc, desc);

    // Assert
    expect(result).toEqual(expected);
  });

  test('process should sort the rows based on a column name in descending order', () => {
    // Arrange
    const orderBy = new OrderBy(false);
    const rows = sampleTable;
    const column = 'age';
    const asc = false;
    const desc = true;
    const expected = [
      { name: 'Dan', age: 30 },
      { name: 'Charlie', age: 28 },
      { name: 'Alice', age: 25 }
    ];

    // Act
    const result = orderBy.process(rows, column, asc, desc);

    // Assert
    expect(result).toEqual(expected);
  });

  test('process should sort the rows based on a column name in no order', () => {
    // Arrange
    const orderBy = new OrderBy(false);
    const rows = sampleTable;
    const column = 'name';
    const asc = false;
    const desc = false;
    const expected = [
      { name: 'Alice', age: 25 },
      { name: 'Charlie', age: 28 },
      { name: 'Dan', age: 30 }
    ];

    // Act
    const result = orderBy.process(rows, column);

    // Assert
    expect(result).toEqual(expected);
  });
});
