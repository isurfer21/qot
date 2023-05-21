export default class Filter {
  constructor(verbose) {
    this.verbose = verbose;
  }

  distinctRows(columns, rows) {
    let filteredRows = rows;
    for (let column in columns) {
      if (columns[column] == 'distinct') {
        // Create an empty array to store the result
        let result = [];
        // Create an empty set to store the seen values of the property
        let seen = new Set();
        // Loop through the data array
        for (let row of filteredRows) {
          // Get the value of the property for the current object
          let value = column == '*' ? JSON.stringify(row) : row[column];
          // Check if the value is already in the seen set
          if (seen.has(value)) {
            // The value is not distinct, skip this object
            continue;
          } else {
            // The value is distinct, add it to the seen set and the result array
            seen.add(value);
            result.push(row);
          }
        }
        // Save the result array
        filteredRows = result;
      }
    }
    return filteredRows;
  }
}
