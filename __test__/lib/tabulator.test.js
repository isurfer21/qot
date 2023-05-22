import { jest, describe, expect, test, beforeEach, afterEach } from '@jest/globals';
import Tabulator from '../../lib/tabulator';
import YAML from 'yaml';

// A sample input type #1, which takes an object with columns and rows properties where the columns property is an object that maps column ids to column titles and the rows property is an array of objects that represent the data for each row, with keys matching the column ids.
const sampleColumnsAndRows = {
  columns: { id: 'ID', name: 'Name', age: 'Age' },
  rows: [
    { id: 1, name: 'Alice', age: 25 },
    { id: 2, name: 'Bob', age: 30 },
    { id: 3, name: 'Charlie', age: 35 }
  ]
};

// A sample input type #2, which returns a 2D array of strings representing the tabulated data where the first element of the array is an array of column titles and the rest of the elements are arrays of row values, in the same order as the columns.
const sampleTabulatedData = [
  ['ID', 'Name', 'Age'],
  [1, 'Alice', 25],
  [2, 'Bob', 30],
  [3, 'Charlie', 35]
];

describe('Tabulator', () => {
  // Declare a variable to store the original console.log function
  let originalLog;

  // Use beforeEach to mock console.log before each test
  beforeEach(() => {
    // Save the original console.log function
    originalLog = console.log;
    // Replace it with a jest mock function
    console.log = jest.fn();
    // Save the original console.table function
    originalTable = console.table;
    // Replace it with a jest mock function
    console.table = jest.fn();
  });

  // Use afterEach to restore console.log after each test
  afterEach(() => {
    // Restore the original console.log function
    console.log = originalLog;
    // Restore the original console.table function
    console.table = originalTable;
  });

  test('toTable converts columns and rows into a 2D array', () => {
    // Arrange
    const { columns, rows } = sampleColumnsAndRows;

    // Act
    let table = Tabulator.toTable(columns, rows);

    // Assert
    expect(table).toEqual([
      ['ID', 'Name', 'Age'],
      [1, 'Alice', 25],
      [2, 'Bob', 30],
      [3, 'Charlie', 35]
    ]);
  });

  test('printAsJSON prints rows as an array of objects in JSON format', () => {
    // Arrange
    const { columns, rows } = sampleColumnsAndRows;

    // Act
    Tabulator.printAsJSON(columns, rows);

    // Assert
    expect(console.log).toHaveBeenCalledTimes(1); // One call for the whole array
    expect(console.log).toHaveBeenCalledWith(
      JSON.stringify(
        [
          { ID: 1, Name: 'Alice', Age: 25 },
          { ID: 2, Name: 'Bob', Age: 30 },
          { ID: 3, Name: 'Charlie', Age: 35 }
        ],
        null,
        2
      )
    ); // The expected JSON output
  });

  test('printAsYAML prints rows as an array of objects in YAML format', () => {
    // Arrange
    const { columns, rows } = sampleColumnsAndRows;

    // Act
    Tabulator.printAsYAML(columns, rows);

    // Assert
    expect(console.log).toHaveBeenCalledTimes(1); // One call for the whole array
    expect(console.log).toHaveBeenCalledWith(
      YAML.stringify([
        { ID: 1, Name: 'Alice', Age: 25 },
        { ID: 2, Name: 'Bob', Age: 30 },
        { ID: 3, Name: 'Charlie', Age: 35 }
      ])
    ); // The expected YAML output
  });

  test('printAsASCII prints rows as an array of objects in ASCII format', () => {
    // Arrange
    const { columns, rows } = sampleColumnsAndRows;

    // Act
    Tabulator.printAsASCII(columns, rows);

    // Assert
    expect(console.table).toHaveBeenCalledTimes(1); // One call for the whole array
    expect(console.table).toHaveBeenCalledWith([
      { ID: 1, Name: 'Alice', Age: 25 },
      { ID: 2, Name: 'Bob', Age: 30 },
      { ID: 3, Name: 'Charlie', Age: 35 }
    ]); // The expected ASCII output
  });

  test('printAsCSV prints tabulated data as comma-separated values', () => {
    // Arrange
    let tabulatedData = sampleTabulatedData;

    // Act
    Tabulator.printAsCSV(tabulatedData);

    // Assert
    expect(console.log).toHaveBeenCalledTimes(4); // One call per row
    expect(console.log).toHaveBeenCalledWith('ID,Name,Age'); // First row
    expect(console.log).toHaveBeenCalledWith('1,Alice,25'); // Second row
    expect(console.log).toHaveBeenCalledWith('2,Bob,30'); // Third row
    expect(console.log).toHaveBeenCalledWith('3,Charlie,35'); // Fourth row
  });

  test('printAsTSV prints tabulated data as tab-separated values', () => {
    // Arrange
    let tabulatedData = sampleTabulatedData;

    // Act
    Tabulator.printAsTSV(tabulatedData);

    // Assert
    expect(console.log).toHaveBeenCalledTimes(4); // One call per row
    expect(console.log).toHaveBeenCalledWith('ID\tName\tAge'); // First row
    expect(console.log).toHaveBeenCalledWith('1\tAlice\t25'); // Second row
    expect(console.log).toHaveBeenCalledWith('2\tBob\t30'); // Third row
    expect(console.log).toHaveBeenCalledWith('3\tCharlie\t35'); // Fourth row
  });

  test('printAsPSV prints tabulated data as pipe-separated values', () => {
    // Arrange
    let tabulatedData = sampleTabulatedData;

    // Act
    Tabulator.printAsPSV(tabulatedData);

    // Assert
    expect(console.log).toHaveBeenCalledTimes(4); // One call per row
    expect(console.log).toHaveBeenCalledWith('ID|Name|Age'); // First row
    expect(console.log).toHaveBeenCalledWith('1|Alice|25'); // Second row
    expect(console.log).toHaveBeenCalledWith('2|Bob|30'); // Third row
    expect(console.log).toHaveBeenCalledWith('3|Charlie|35'); // Fourth row
  });

  test('printAsHTM prints tabulated data as an HTM table', () => {
    // Arrange
    let tabulatedData = sampleTabulatedData;

    // Act
    Tabulator.printAsHTM(tabulatedData);

    // Assert
    expect(console.log).toHaveBeenCalledTimes(1); // One call for the whole table
    expect(console.log).toHaveBeenCalledWith(
      '<table><thead><tr><th>ID</th><th>Name</th><th>Age</th></tr></thead><tbody><tr><td>1</td><td>Alice</td><td>25</td></tr><tr><td>2</td><td>Bob</td><td>30</td></tr><tr><td>3</td><td>Charlie</td><td>35</td></tr></tbody></table>'
    ); // The expected HTML output
  });

  test('printAsHTML prints tabulated data as an HTML table', () => {
    // Arrange
    let tabulatedData = sampleTabulatedData;

    // Act
    Tabulator.printAsHTML(tabulatedData);

    // Assert
    expect(console.log).toHaveBeenCalledTimes(1); // One call for the whole table
    expect(console.log).toHaveBeenCalledWith(
      `<table>
  <thead>
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Age</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>Alice</td>
      <td>25</td>
    </tr>
    <tr>
      <td>2</td>
      <td>Bob</td>
      <td>30</td>
    </tr>
    <tr>
      <td>3</td>
      <td>Charlie</td>
      <td>35</td>
    </tr>
  </tbody>
</table>`
    ); // The expected HTML output
  });

  test('printAsMarkdown prints tabulated data as a markdown table', () => {
    // Arrange
    let tabulatedData = sampleTabulatedData;

    // Act
    Tabulator.printAsMarkdown(tabulatedData);

    // Assert
    expect(console.log).toHaveBeenCalledTimes(1); // One call for the whole table
    expect(console.log).toHaveBeenCalledWith('|ID|Name   |Age|\n|--|-------|---|\n|1 |Alice  |25 |\n|2 |Bob    |30 |\n|3 |Charlie|35 |\n');
  });

  test('printAsTable prints tabulated data as a formatted table', () => {
    // Arrange
    let tabulatedData = sampleTabulatedData;

    // Act
    Tabulator.printAsTable(tabulatedData);

    // Assert
    expect(console.log).toHaveBeenCalledTimes(4); // One call per row
    expect(console.log).toHaveBeenCalledWith('ID  Name     Age  '); // First row
    expect(console.log).toHaveBeenCalledWith('1   Alice    25   '); // Second row
    expect(console.log).toHaveBeenCalledWith('2   Bob      30   '); // Third row
    expect(console.log).toHaveBeenCalledWith('3   Charlie  35   '); // Fourth row
  });
});
