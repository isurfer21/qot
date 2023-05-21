import { describe, expect, test } from '@jest/globals';
import Aggregator from '../../lib/aggregator';

describe('Aggregator', () => {
  test('aggregateColumns should calculate the aggregate values for each column', () => {
    let aggregator = new Aggregator(false);
    let aggregates = {age: 'AVG', salary: 'SUM'};
    let filteredRows = [
      {name: 'Alice', age: 20, salary: 1000},
      {name: 'Bob', age: 21, salary: 2000},
      {name: 'Charlie', age: 23, salary: 3000}
    ];
    expect(aggregator.aggregateColumns(aggregates, filteredRows)).toEqual({
      age: 21.333333333333332,
      salary: 6000
    });
  });

  test('aggregateColumns should return an empty object if no aggregates are given', () => {
    let aggregator = new Aggregator(false);
    let aggregates = {};
    let filteredRows = [
      {name: 'Alice', age: 20, salary: 1000},
      {name: 'Bob', age: 21, salary: 2000},
      {name: 'Charlie', age: 23, salary: 3000}
    ];
    expect(aggregator.aggregateColumns(aggregates, filteredRows)).toEqual({});
  });

  test('aggregateRow should return a single row with the aggregate values for each column', () => {
    let aggregator = new Aggregator(false);
    let aggregates = {age: 'AVG', salary: 'SUM'};
    let filteredRows = [
      {name: 'Alice', age: 20, salary: 1000},
      {name: 'Bob', age: 21, salary: 2000},
      {name: 'Charlie', age: 23, salary: 3000}
    ];
    expect(aggregator.aggregateRow(aggregates, filteredRows)).toEqual([
      {name: '-', age: 21.333333333333332, salary: 6000}
    ]);
  });

  test('aggregateRow should return undefined if no aggregates are given', () => {
    let aggregator = new Aggregator(false);
    let aggregates = {};
    let filteredRows = [
      {name: 'Alice', age: 20, salary: 1000},
      {name: 'Bob', age: 21, salary: 2000},
      {name: 'Charlie', age: 23, salary: 3000}
    ];
    expect(aggregator.aggregateRow(aggregates, filteredRows)).toBeUndefined();
  });
});
