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

### Important Tips

When defining a query statement, it's important to consider the conditions in the `--where` clause. If the column name or cell value contains spaces, you can use one of the following formats on the command line to avoid unintended results.

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

### How to perform a query?

To perform a query on a `.csv` file that contains tabular data, you need to use the `--select` option to specify the columns you want to display and the `--from` option to specify the file name. If you want to apply a condition to filter the query result, you can use the `--where` option. If you want to limit the number of rows in the query result, you can use the `--limit` option. If you want to sort the query result by a certain column, you can use the `--orderby` option and choose either `--asc` or `--desc` to order the result in ascending or descending order.

#### Using `--select` option

Here are few possible examples of `--select` option where _columns_ are defined in various different ways:

- Selecting a single column: 

  `--select "name"`

- Selecting multiple columns: 

  `--select "name, address, phone"`

- Selecting all columns: 

  `--select "'*'"`

- Selecting a column with an alias: 

  `--select "sex AS gender"`

- Selecting a column with a function: 

  `--select "COUNT(name)"`

- Selecting a column with a filter: 

  `--select "DISTINCT lastname"`

- Selecting a column with spaces: 

  `--select "'first name', 'last name'"`

- Selecting a column with special characters: 

  `--select "phone_number, product-type, 'discount %'"`

Note: Selecting a column with a _subquery_, _calculation_ or _case-expression_ is not yet supported.

#### Using `--from` option

The `--from` option is used to specify the name of the `.csv` file that contains the tabular data you want to query. The file name should include the extension `.csv` and should be enclosed in quotes if it contains spaces or special characters. For example:

- To query a file named `customers.csv`: 

  `--from customers.csv`

- To query a file named `sales report.csv`: 

  `--from "sales report.csv"`

- To query a file named `data_2021-10-31.csv`: 

  `--from data_2021-10-31.csv`

#### Using `--where` option

The `--where` option is used to apply a condition to filter the query result. The condition should be a logical expression that evaluates to true or false for each row in the table. You can use comparison operators, logical operators, and parentheses to construct complex conditions. For example, to query only the rows 

- Where the name column is 'John': 

  `--where "name = 'John'"`

- Where the age column is less than 18: 

  `--where "age < 18"`

- Where the country column is either 'USA' or 'Canada': 

  `--where "country IN ('USA', 'Canada')"`

- Where the price column is between 10 and 20: 

  `--where "price BETWEEN 10 AND 20"`

- Where the name column starts with 'A': 

  `--where "name LIKE 'A%'"`

- Where the name column is not null: 

  `--where "name IS NOT NULL"`

- Where both the name and age columns match a condition: 

  `--where "name = 'John' AND age > 25"`

- Where either the name or age columns match a condition: 

  `--where "name = 'John' OR age > 25"`

- Where the name column matches one condition and the age column matches another condition:    

  `--where "(name = 'John' OR name = 'Jane') AND (age > 25 OR age < 18)"`

#### Using `--orderby` option with `--asc` & `--desc`

The `--orderby` option is used to sort the query result by a certain column. You can specify the column name after the option and use either `--asc` or `--desc` to order the result in ascending or descending order. If you do not specify the order, the default is ascending. For example:

- To sort the query result by the name column in ascending order: 

  `--orderby name --asc`

- To sort the query result by the age column in descending order: 

  `--orderby age --desc`

- To sort the query result by the country column in ascending order: 

  `--orderby country`

Note: Sorting the query result by multiple columns is not yet supported.

## Contributing

If you'd like to contribute to the development of QoT, please check out our [contributing guidelines](https://github.com/isurfer21/qot/blob/master/CONTRIBUTING.md).

## License

QoT is licensed under the [MIT License](https://github.com/isurfer21/qot/blob/master/LICENSE).