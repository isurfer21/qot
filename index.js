#!/usr/bin/env node

import { promises as fs } from 'fs';
import { parse } from 'csv-parse/sync';
import minimist from 'minimist';
import WhereAST from './lib/where-ast.js';
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

async function main() {
  const verbose = !!argv?.verbose;
  verbose && console.log('Arguments:', argv);
  if (argv.help) {
    console.log(helpMenu);
  } else if (argv.version) {
    try {
      const pkg = await fs.readFile('package.json', 'utf8');
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

      let filteredRows = rows;

      let columns = [];
      if (select) {
        if (select.trim() == '*') {
          columns = Object.keys(rows[0]);
        } else {
          columns = select.split(',');
        }
      }

      if (where) {
        const whereAST = new WhereAST(verbose);
        const ast = whereAST.generateAST(where);
        const expr = whereAST.toJavaScript(ast);
        verbose && console.log('Expression:', expr);
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
}

main();