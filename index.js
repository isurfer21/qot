#!/usr/bin/env node

import fs from 'fs';
import { parse } from 'csv-parse/sync';
import minimist from 'minimist';
import ASTGenerator from './lib/ast-generator.js';
import Tabulator from './lib/tabulator.js';

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
    d: 'desc'
  }
});

console.log(argv)

if (argv.help) {
  console.log(`QoT - Query over Table

Syntax:
  qot (--help | -h)
  qot (--version | -v)
  qot -select <columns> -from <filepath> -where <condition>
  qot -select <columns> -from <filepath> -where <condition> -limit <number> -orderby <column> (-asc | -desc)

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
     --csv                  Print in CSV format
     --tsv                  Print in TSV format
     --psv                  Print in PSV format
     --htm                  Print in HTM format
     --html                 Print in HTML format
     --json                 Print in JSON format

Usage:
  qot -select firstname,lastname,mobile,email -from 'sample.csv' -where 'age<30' -limit 10 -orderby age -desc
  qot -select=firstname,age,email -from='sample.csv' -where='age<30' -limit=10 -orderby=age -asc
  qot -select:firstname,mobile -from:'sample.csv' -where:'age<30 and firstname=Mario' -limit:10`);
} else if (argv.version) {
  const pkg = fs.readFileSync('package.json', 'utf8');
  const { version } = JSON.parse(pkg);
  console.log(`QoT version ${version}`);
} else {
  // Add your code here to handle the other arguments and perform the query over table operation.
  if (argv.select && argv.from) {
    const file = fs.readFileSync(argv.from);
    const rows = parse(file, { columns: true });

    const columns = argv.select.split(',');
    const where = argv.where;
    const limit = argv.limit;
    const orderby = argv.orderby;
    const asc = argv.asc;
    const desc = argv.desc;

    let filteredRows = rows;

    if (where) {
      const astGenerator = new ASTGenerator();
      const ast = astGenerator.generateAST(where);
      const expr = astGenerator.toJavaScript(ast);
      console.log('Expression:', expr);
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

    if (argv.json) {
      Tabulator.printAsJSON(columns, filteredRows);
    } else if (argv.yaml) {
      Tabulator.printAsYAML(columns, filteredRows);
    } else {
      let tabulatedData = Tabulator.toTable(columns, filteredRows);
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