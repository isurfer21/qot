import { describe, expect, test } from '@jest/globals';
import Filter from '../../lib/Filter';

describe('Filter', () => {
  test('distinctRows should remove duplicate rows based on a column', () => {
    let filter = new Filter(false);
    let columns = {name: 'distinct'};
    let rows = [
      {name: 'Alice', age: 20},
      {name: 'Bob', age: 21},
      {name: 'Alice', age: 22},
      {name: 'Charlie', age: 23}
    ];
    expect(filter.distinctRows(columns, rows)).toEqual([
      {name: 'Alice', age: 20},
      {name: 'Bob', age: 21},
      {name: 'Charlie', age: 23}
    ]);
  });

  test('distinctRows should remove duplicate rows based on all columns', () => {
    let filter = new Filter(false);
    let columns = {'*': 'distinct'};
    let rows = [
      {name: 'Alice', age: 20},
      {name: 'Bob', age: 21},
      {name: 'Alice', age: 22},
      {name: 'Charlie', age: 23}
    ];
    expect(filter.distinctRows(columns, rows)).toEqual([
      {name: 'Alice', age: 20},
      {name: 'Bob', age: 21},
      {name: 'Alice', age: 22},
      {name: 'Charlie', age: 23}
    ]);
  });

  test('distinctRows should return the original rows if no columns are distinct', () => {
    let filter = new Filter(false);
    let columns = {};
    let rows = [
      {name: 'Alice', age: 20},
      {name: 'Bob', age: 21},
      {name: 'Alice', age: 22},
      {name: 'Charlie', age: 23}
    ];
    expect(filter.distinctRows(columns, rows)).toEqual(rows);
  });

  test('distinctRows should return an empty array if the rows are empty', () => {
    let filter = new Filter(false);
    let columns = {'*': 'distinct'};
    let rows = [];
    expect(filter.distinctRows(columns, rows)).toEqual([]);
  });
});
