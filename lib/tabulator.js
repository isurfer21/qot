import YAML from 'yaml';

export default class Tabulator {
  static toTable(filteredColumns, filteredRows) {
    let result = [filteredColumns];
    for (let row of filteredRows) {
      let rowValues = [];
      for (let column of filteredColumns) {
        rowValues.push(row[column]);
      }
      result.push(rowValues);
    }
    return result;
  }

  static printAsJSON(filteredColumns, filteredRows) {
    let data = filteredRows.map(row => {
      let obj = {};
      for (let column of filteredColumns) {
        obj[column] = row[column];
      }
      return obj;
    });
    console.log(JSON.stringify(data, null, 2));
  }

  static printAsYAML(filteredColumns, filteredRows) {
    let data = filteredRows.map(row => {
      let obj = {};
      for (let column of filteredColumns) {
        obj[column] = row[column];
      }
      return obj;
    });
    console.log(YAML.stringify(data));
  }


  static printAsCSV(tabulatedData) {
    for (let row of tabulatedData) {
      let newRow = row.map(item => {
        if (/[ ,]/.test(item)) {
          return `"${item}"`;
        } else {
          return item;
        }
      });
      console.log(newRow.join(','));
    }
  }

  static printAsTSV(tabulatedData) {
    for (let row of tabulatedData) {
      let newRow = row.map(item => {
        if (/[ \t]/.test(item)) {
          return `"${item}"`;
        } else {
          return item;
        }
      });
      console.log(newRow.join('\t'));
    }
  }

  static printAsPSV(tabulatedData) {
    for (let row of tabulatedData) {
      let newRow = row.map(item => {
        if (/[ |]/.test(item)) {
          return `"${item}"`;
        } else {
          return item;
        }
      });
      console.log(newRow.join('|'));
    }
  }

  static printAsHTM(tabulatedData) {
    let [headerRow, ...bodyRows] = tabulatedData;
    let html = '<table>';
    html += '<thead><tr>';
    html += headerRow.map(item => `<th>${item}</th>`).join('');
    html += '</tr></thead>';
    html += '<tbody>';
    html += bodyRows.map(row => {
      let rowHtml = '<tr>';
      rowHtml += row.map(item => `<td>${item}</td>`).join('');
      rowHtml += '</tr>';
      return rowHtml;
    }).join('');
    html += '</tbody>';
    html += '</table>';
    console.log(html);
  }

  static printAsHTML(tabulatedData) {
    let [headerRow, ...bodyRows] = tabulatedData;
    let html = '<table>\n';
    html += '  <thead>\n    <tr>\n';
    html += headerRow.map(item => `      <th>${item}</th>`).join('\n');
    html += '\n    </tr>\n  </thead>\n';
    html += '  <tbody>\n';
    html += bodyRows.map(row => {
      let rowHtml = '    <tr>\n';
      rowHtml += row.map(item => `      <td>${item}</td>`).join('\n');
      rowHtml += '\n    </tr>';
      return rowHtml;
    }).join('\n');
    html += '\n  </tbody>\n';
    html += '</table>';
    console.log(html);
  }

  static printAsTable(tabulatedData) {
    let columnWidths = new Array(tabulatedData[0].length).fill(0);
    for (let row of tabulatedData) {
      for (let i = 0; i < row.length; i++) {
        columnWidths[i] = Math.max(columnWidths[i], String(row[i]).length);
      }
    }
    for (let row of tabulatedData) {
      let rowString = '';
      for (let i = 0; i < row.length; i++) {
        rowString += String(row[i]).padEnd(columnWidths[i] + 2);
      }
      console.log(rowString);
    }
  }
}