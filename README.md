# qot

**Query over Table**, a.k.a., **QoT** is a command-line tool that allows you to query data from tables or sheets.

## Introduction

QoT (Query over Table) is a powerful command-line tool that allows you to query data from tables or sheets. With QoT, you can easily filter, sort, and display data from CSV, TSV, PSV, HTML, JSON, and YAML files.

QoT is designed to be easy to use and provides a wide range of options for customizing your queries. Whether you're a data analyst looking to quickly extract insights from large datasets or a developer looking to integrate QoT into your workflow, QoT has something to offer.

In this guide, we'll introduce you to the basics of using QoT and show you how to get started with querying your data.

### Working

This program uses the `csv-parse` and `minimist` modules to parse CSV data and command-line arguments, respectively. The program filters the data based on the conditions specified by the `--where` options and sorts the data based on the column specified by the `--orderby` option. The program also limits the number of rows displayed based on the value specified by the `--limit` option.

You can run this program from the command line by passing the appropriate arguments. For example:

```
node qot.js --select firstname,lastname,mobile,email --from sample.csv --where age<30 --limit 10 --orderby age --desc
```

This command will select the `firstname`, `lastname`, `mobile`, and `email` columns from the `sample.csv` file where the `age` is less than `30`. The results will be sorted by `age` in descending order and only the first `10` rows will be displayed.

## Prerequisite
You should have these applications installed at your system.

- [node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (usually it comes along with node.js)

## Installation
You can install it at your system via npm

```
npm install qot-cli --global
qot -v
```

## Manual Setup

To install QoT, simply download the latest release from the [releases page](https://github.com/isurfer21/qot/releases) and setup locally as per the given instructions.

```
git clone https://github.com/isurfer21/qot.git
cd qot
node index.js -h
```

## Usage

To use QoT, you can run the `qot` command followed by the desired options. Here's an overview of the available options:

```
$ qot --help
QoT - Query over Table

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
  qot --select:firstname,mobile --from:'sample.csv' --where:'age<30 and firstname=Mario' --limit:10

```

### Tips

When defining a query statement, it's important to consider the conditions in the `WHERE` clause. If the column name or cell value contains spaces, you can use one of the following formats on the command line to avoid unintended results.

1. When the entire statement is enclosed in single quotes ('), the operands should be contained within back quotes (\`).

```
`Column Name` = `Value`
```

e.g., if you want to search for rows where the `Job Title` is `Market Researcher`, you can use one of the following queries:

```
`Job Title` = `Market Researcher`
```

2. When the entire statement is enclosed in double quotes ("), the words should be contained within back quotes (').

```
'Column Name' = 'Value'
```

e.g., if you want to search for rows where the `Job Title` is `Market Researcher`, you can use one of the following queries:

```
'Job Title' = 'Market Researcher'
```

## Contributing

If you'd like to contribute to the development of QoT, please check out our [contributing guidelines](https://github.com/isurfer21/qot/blob/master/CONTRIBUTING.md).

## License

QoT is licensed under the [MIT License](https://github.com/isurfer21/qot/blob/master/LICENSE).