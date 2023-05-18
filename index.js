#!/usr/bin/env node

import { promises as fs } from 'fs';
import { parse } from 'csv-parse/sync';
import process from 'node:process';
import { fileURLToPath } from 'url';
import path from 'path';
import minimist from 'minimist';
import SelectAST from './lib/select/select-ast.js';
import WhereAST from './lib/where/where-ast.js';
import Tabulator from './lib/tabulator.js';

const helpMenu = `QoT - Query over Table

Syntax:
  qot [options]

  qot (--help | -h)
  qot (--version | -v)

  qot --select <columns> --from <filepath> --where <condition> (--verbose)
  qot --select <columns> --from <filepath> --where <condition> --limit <number> --orderby <column> (--asc | --desc)
  qot --select <columns> --from <filepath> (--csv | --tsv | --psv | --html | --json | --yaml)

Options:
  -h --help                 Help description
  -v --version              Version information

  -s --select <columns>     Select columns to display
  -f --from <filepath>      File path of table or sheet
  -w --where <condition>    Filter condition
  -l --limit <rows>         Number of rows to display
  -o --orderby <column>     Order by column
  -a --asc                  Sort in ascending order
  -d --desc                 Sort in descending order

  -V --verbose              For troubleshooting

     --csv                  Print in CSV format
     --tsv                  Print in TSV format
     --psv                  Print in PSV format
     --htm                  Print in HTM format
     --html                 Print in HTML format
     --json                 Print in JSON format
     --yaml                 Print in YAML format

Usage:
  qot --select * --from 'sample.csv'
  qot --select firstname,lastname,mobile,email --from 'sample.csv' --where 'age<30' --limit 10 --orderby age --desc
  qot --select=firstname,age,email --from='sample.csv' --where='age<30' --limit=10 --orderby=age --asc
  qot --select:firstname,mobile --from:'sample.csv' --where:'age<30 and firstname=Mario' --limit:10`;

const argv = minimist(process.argv.slice(2), {
  alias: {
    h: 'help',
    v: 'version',
    s: 'select',
    f: 'from',
    w: 'where',
    l: 'limit',
    o: 'orderby',
    a: 'asc',
    d: 'desc',
    V: 'verbose'
  }
});

const __filename = fileURLToPath (import.meta.url);
const __dirname = path.dirname (__filename);

async function main() {
  const verbose = !!argv?.verbose;
  verbose && console.log('Arguments:', argv);
  if (argv.help) {
    console.log(helpMenu);
  } else if (argv.version) {
    try {
      const pkg = await fs.readFile(path.resolve(__dirname, 'package.json'), 'utf8');
      const { version } = JSON.parse(pkg);
      console.log(`QoT version ${version}`);
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  } else {
    // Handle the other arguments and perform the query over table operation.
    if (argv.select && argv.from) {
      let rows;
      try {
        const file = await fs.readFile(argv.from);
        rows = parse(file, { columns: true });
      } catch (err) {
        console.error(err.message);
        process.exit(1);
      }

      const select = argv.select;
      const where = argv.where;
      const limit = argv.limit;
      const orderby = argv.orderby;
      const asc = argv.asc;
      const desc = argv.desc;

      let filteredRows = rows,
        columns = [],
        aggregates = [];

      if (select) {
        const selectAST = new SelectAST(verbose);
        const ast = selectAST.generateAst(select);
        const columnIds = Object.keys(rows[0]);
        columns = selectAST.toColumns(ast, columnIds);
        verbose && console.log('Select Columns:', columns);
        aggregates = selectAST.aggregators(ast);
        verbose && console.log('Select Aggregates:', aggregates);
      }

      if (where) {
        const whereAST = new WhereAST(verbose);
        const ast = whereAST.generateAst(where);
        const expr = whereAST.toJavaScript(ast);
        verbose && console.log('Where Expression:', expr);
        filteredRows = filteredRows.filter(row => eval(expr));
      }

      if (orderby) {
        filteredRows.sort((a, b) => {
          if (a[orderby] < b[orderby]) return asc ? -1 : 1;
          if (a[orderby] > b[orderby]) return asc ? 1 : -1;
          return 0;
        });
      }

      if (limit) {
        filteredRows = filteredRows.slice(0, limit);
      }

      let finalRows = filteredRows;

      if (filteredRows.length > 0 && Object.keys(aggregates).length > 0) {
        let aggregatedRow = {};
        for (let column in aggregates) {
          const aggregateMethod = aggregates[column];
          // Assuming the array of rows is called filteredRows where each row consist column-values as KV pairs
          switch (aggregateMethod) {
            case 'COUNT':
              // Calculate the number of rows that have a value for the column
              let count = filteredRows.filter(row => row[column] != null).length;
              aggregatedRow[column] = count;
              break;
            case 'SUM':
              // Calculate the sum of the values of the column for all rows
              let sum = filteredRows.reduce((acc, row) => acc + row[column], 0);
              aggregatedRow[column] = sum;
              break;
            case 'AVG':
              // Calculate the average of the values of the column for all rows
              let avg = filteredRows.reduce((acc, row) => acc + row[column], 0) / filteredRows.length;
              aggregatedRow[column] = avg;
              break;
            case 'MIN':
              // Calculate the minimum value of the column for all rows
              let min = Math.min(...filteredRows.map(row => row[column]));
              aggregatedRow[column] = min;
              break;
            case 'MAX':
              // Calculate the maximum value of the column for all rows
              let max = Math.max(...filteredRows.map(row => row[column]));
              aggregatedRow[column] = max;
              break;
            case 'distinct':
              // Create an empty array to store the result
              let result = [];
              // Create an empty set to store the seen values of the property
              let seen = new Set();
              // Loop through the data array
              for (let row of filteredRows) {
                // Get the value of the property for the current object
                let value = row[column];
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
              finalRows = result;
              break;
          }
        }
        if (Object.keys(aggregatedRow).length > 0) {
          finalRows = [filteredRows.shift()];
          for (let column in finalRows[0]) {
            if (Object.keys(aggregates).includes(column)) {
              finalRows[0][column] = aggregatedRow[column];
            } else {
              finalRows[0][column] = '-';
            }
          }
        }
      }

      if (argv.json) {
        Tabulator.printAsJSON(columns, finalRows);
      } else if (argv.yaml) {
        Tabulator.printAsYAML(columns, finalRows);
      } else {
        let tabulatedData = Tabulator.toTable(columns, finalRows);
        if (argv.csv) {
          Tabulator.printAsCSV(tabulatedData);
        } else if (argv.tsv) {
          Tabulator.printAsTSV(tabulatedData);
        } else if (argv.psv) {
          Tabulator.printAsPSV(tabulatedData);
        } else if (argv.htm) {
          Tabulator.printAsHTM(tabulatedData);
        } else if (argv.html) {
          Tabulator.printAsHTML(tabulatedData);
        } else {
          Tabulator.printAsTable(tabulatedData);
        }
      }
    }
  }
}

main();
