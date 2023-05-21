export default class Aggregator {
  constructor(verbose) {
    this.verbose = verbose;
  }

  aggregateColumns(aggregates, filteredRows) {
    let aggregatedColumns = {};
    for (let column in aggregates) {
      const aggregateMethod = aggregates[column];
      // Assuming the array of rows is called filteredRows where each row consist column-values as KV pairs
      switch (aggregateMethod) {
        case 'COUNT':
          // Calculate the number of rows that have a value for the column
          let count = filteredRows.filter(row => row[column] != null).length;
          aggregatedColumns[column] = count;
          break;
        case 'SUM':
          // Calculate the sum of the values of the column for all rows
          let sum = filteredRows.reduce((acc, row) => acc + +row[column], 0);
          aggregatedColumns[column] = sum;
          break;
        case 'AVG':
          // Calculate the average of the values of the column for all rows
          let avg = filteredRows.reduce((acc, row) => acc + +row[column], 0) / filteredRows.length;
          aggregatedColumns[column] = avg;
          break;
        case 'MIN':
          // Calculate the minimum value of the column for all rows
          let min = Math.min(...filteredRows.map(row => +row[column]));
          aggregatedColumns[column] = min;
          break;
        case 'MAX':
          // Calculate the maximum value of the column for all rows
          let max = Math.max(...filteredRows.map(row => +row[column]));
          aggregatedColumns[column] = max;
          break;
      }
    }
    return aggregatedColumns;
  }

  aggregateRow(aggregates, filteredRows) {
    let aggregatedRow,
      aggregatedColumns = this.aggregateColumns(aggregates, filteredRows);
    if (Object.keys(aggregatedColumns).length > 0) {
      aggregatedRow = [filteredRows.shift()];
      for (let column in aggregatedRow[0]) {
        if (Object.keys(aggregates).includes(column)) {
          aggregatedRow[0][column] = aggregatedColumns[column];
        } else {
          aggregatedRow[0][column] = '-';
        }
      }
    }
    return aggregatedRow;
  }
}
