import Utility from './utility.js';

export default class OrderBy {
  constructor(verbose) {
    this.verbose = verbose;
  }

  // A method that sorts the rows based on a column name using the `ORDER BY` clause in ascending or descending order
  process(rows, orderby, asc, desc) {
    // Convert double dots to spaces in the column name
    let column = Utility.dualDotToSpace(orderby);
    // When ASC or DESC keyword is not specified, the ORDER BY clause sorts the records in ascending order by default
    if (asc == undefined && desc == undefined) {
      asc = true;
    }
    // Sort the rows using a compare function
    rows.sort((a, b) => {
      if (a[column] < b[column]) return asc ? -1 : desc ? 1 : 0;
      if (a[column] > b[column]) return asc ? 1 : desc ? -1 : 0;
      return 0;
    });
    // Return the sorted rows
    return rows;
  }
}
