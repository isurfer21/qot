# qot

> A command-line utility for CSV data analysis

**Query over Table**, a.k.a., **QoT** is a command-line tool that allows you to query data from tables or sheets.

<!-- TOC -->

- [qot](#qot)
    - [Introduction](#introduction)
        - [How the qot tool works?](#how-the-qot-tool-works)
    - [Prerequisite](#prerequisite)
    - [Installation](#installation)
    - [Manual Setup](#manual-setup)
    - [Usage](#usage)
        - [Quoting and dotting spaces in query statements](#quoting-and-dotting-spaces-in-query-statements)
    - [Contributing](#contributing)
    - [License](#license)
- [FAQ](#faq)
    - [How to perform a query?](#how-to-perform-a-query)
        - [Using --select option](#using---select-option)
        - [Using --from option](#using---from-option)
        - [Using --where option](#using---where-option)
        - [Using --orderby option with --asc & --desc](#using---orderby-option-with---asc----desc)
    - [How to use the date-time format in the qot tool?](#how-to-use-the-date-time-format-in-the-qot-tool)
    - [How to use spaces in command line arguments for qot tool on Windows?](#how-to-use-spaces-in-command-line-arguments-for-qot-tool-on-windows)

<!-- /TOC -->

## Introduction

QoT (Query over Table) is a powerful command-line tool that allows you to query data from tables or sheets. With QoT, you can easily filter & sort data from a CSV file and display the result in any of these supported formats: CSV, TSV, PSV, HTML table, JSON, YAML, ASCII grid table, Markdown table, or borderless table (default).

QoT is designed to be easy to use and provides a wide range of options for customizing your queries. Whether you're a data analyst looking to quickly extract insights from large datasets or a developer looking to integrate QoT into your workflow, QoT has something to offer.

In this guide, we'll introduce you to the basics of using QoT and show you how to get started with querying your data.

### How the `qot` tool works?

This program uses the `csv-parse` and `minimist` modules to parse CSV data and command-line arguments, respectively. The program filters the data based on the conditions specified by the `--where` options and sorts the data based on the column specified by the `--orderby` option. The program also limits the number of rows displayed based on the value specified by the `--limit` option. Finally, it prints data for selected columns specified by the `--select` option.

You can run this program from the command line by passing the appropriate arguments. For example:

```
qot --select firstname,lastname,mobile,email --from sample.csv --where age<30 --limit 10 --orderby age --desc
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
     --htm                  Print in HTM table format
     --html                 Print in HTML table format
     --json                 Print in JSON format
     --yaml                 Print in YAML format
     --ascii                Print in ASCII grid table format
     --md                   Print in Markdown table format

Usage:
  qot --select * --from 'sample.csv'
  qot --select firstname,lastname,mobile,email --from 'sample.csv' --where 'age<30' --limit 10 --orderby age --desc
  qot --select=firstname,age,email --from='sample.csv' --where='age<30' --limit=10 --orderby=age --asc
  qot --select:firstname,mobile --from:'sample.csv' --where:'age<30 and firstname=Mario' --limit:10

```

### Quoting and dotting spaces in query statements

When defining a query statement, it's important to consider the conditions in the `--where` clause and coumn names in `--select` clause. If the column name or cell value contains spaces, you can use one of the following formats on the command line to avoid unintended results.

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

3. Use (..) characters in place of spaces to further avoid any space-related issues, even after enclosing the string with spaces in quotes.

```
'Column..Name'..=..'Value..as..string'
```

e.g., if you want to search for rows where the `Job Title` is `Market Researcher`, you can use one of the following queries:

```
'Job..Title'..=..'Market..Researcher'
```

## Contributing

If you'd like to contribute to the development of QoT, please check out our [contributing guidelines](https://github.com/isurfer21/qot/blob/master/CONTRIBUTING.md).

## License

QoT is licensed under the [MIT License](https://github.com/isurfer21/qot/blob/master/LICENSE).

# FAQ

## How to perform a query?

To perform a query on a `.csv` file that contains tabular data, you need to use the `--select` option to specify the columns you want to display and the `--from` option to specify the file name. If you want to apply a condition to filter the query result, you can use the `--where` option. If you want to limit the number of rows in the query result, you can use the `--limit` option. If you want to sort the query result by a certain column, you can use the `--orderby` option and choose either `--asc` or `--desc` to order the result in ascending or descending order.

### Using `--select` option

Here are few possible examples of `--select` option where _columns_ are defined in various different ways:

- Selecting a single column: 

```
--select "name"
```

- Selecting multiple columns: 

```
--select "name, address, phone"
```

- Selecting all columns: 

```
--select "'*'"
```

- Selecting a column with an alias: 

```
--select "sex AS gender"
```

- Selecting a column with a function: 

```
--select "COUNT(name)"
```

- Selecting a column with a filter: 

```
--select "DISTINCT lastname"
```

- Selecting a column with spaces: 

```
--select "'first name', 'last name'"
```

- Selecting a column with special characters: 

```
--select "phone_number, product#, discount@rate, price$, 'saving%', 'product-type'"
```

Note: Selecting a column with a _subquery_, _calculation_ or _case-expression_ is not yet supported.

### Using `--from` option

The `--from` option is used to specify the name of the `.csv` file that contains the tabular data you want to query. The file name should include the extension `.csv` and should be enclosed in quotes if it contains spaces or special characters. For example:

- To query a file named `customers.csv`: 

```
--from customers.csv
```

- To query a file named `sales report.csv`: 

```
--from "sales report.csv"
```

- To query a file named `data_2021-10-31.csv`: 

```
--from data_2021-10-31.csv
```

### Using `--where` option

The `--where` option is used to apply a condition to filter the query result. The condition should be a logical expression that evaluates to true or false for each row in the table. You can use comparison operators, logical operators, and parentheses to construct complex conditions. For example, to query only the rows 

- Where the name column is 'John': 

```
--where "name = 'John'"
```

- Where the age column is less than 18: 

```
--where "age < 18"
```

- Where the country column is either 'USA' or 'Canada': 

```
--where "country IN ('USA', 'Canada')"
```

- Where the price column is between 10 and 20: 

```
--where "price BETWEEN 10 AND 20"
```

- Where the name column starts with 'A': 

```
--where "name LIKE 'A%'"
--where "name LIKE 'A'"
```

- Where the name column is not null: 

```
--where "name IS NOT NULL"
```

- Where both the name and age columns match a condition: 

```
--where "name = 'John' AND age > 25"
```

- Where either the name or age columns match a condition: 

```
--where "name = 'John' OR age > 25"
```

- Where the name column matches one condition and the age column matches another condition:    

```
--where "(name = 'John' OR name = 'Jane') AND (age > 25 OR age < 18)"
```

- Where the date_of_birth column matches a condition which contains date:

```
--where "date_of_birth < '1930-01-01'"
```

- Where the date_of_birth column matches a condition which contains range of dates:

```
--where "date_of_birth BETWEEN '1930-01-01' AND '1939-12-31'"
```

### Using `--orderby` option with `--asc` & `--desc`

The `--orderby` option is used to sort the query result by a certain column. You can specify the column name after the option and use either `--asc` or `--desc` to order the result in ascending or descending order. If you do not specify the order, the default is ascending. For example:

- To sort the query result by the name column in ascending order: 

```
--orderby name --asc
```

- To sort the query result by the age column in descending order: 

```
--orderby age --desc
```

- To sort the query result by the country column in ascending order: 

```
--orderby country
```

Note: Sorting the query result by multiple columns is not yet supported.

## How to use the date-time format in the `qot` tool?

The `qot` tool uses the **ISO 8601 extended format** to handle date and time data. This is a common and clear way of writing date and time values that avoids confusion and allows easy comparison. The ISO 8601 extended format looks like this: `YYYY-MM-DDTHH:mm:ss.sssZ`.

Here is what each part of the format means:

- `YYYY` is the year in four digits. For example, 2023.
- `MM` is the month in two digits. For example, 05 for May.
- `DD` is the day in two digits. For example, 26.
- `T` is a letter that separates the date and time parts.
- `HH` is the hour in two digits, using the 24-hour clock. For example, 07 for 7 a.m. or 19 for 7 p.m.
- `mm` is the minute in two digits. For example, 32.
- `ss` is the second in two digits. For example, 51.
- `sss` is the fractional second in one to six digits. For example, 123 for 0.123 seconds. This part is optional.
- `Z` is a letter that indicates UTC (Coordinated Universal Time) timezone. This means that the date and time value is the same everywhere in the world. This part is optional.
- `[+-]hh:mm` is an alternative way of specifying the timezone, by giving the difference from UTC in hours and minutes. For example, +05:30 means that the date and time value is 5 hours and 30 minutes ahead of UTC. This part is optional.

The `qot` tool can accept different variations of the _ISO 8601 extended format_, as long as they follow this pattern:

```
YYYY-MM-DD(THH:mm(:ss(.sss)?)?(Z|[+-]hh:mm)?)?
```

where, 

- The _parentheses_ mean that some parts are optional.
- The _pipe_ means otherwise which is used to separate two alternative options for a part of the format.
- The _question mark_ means that they can appear zero or one times.

Here are some examples of _valid_ date-time values for the qot tool:

- 2023-05-26
- 2023-05-26T07:32:51
- 2023-05-26T07:32:51.123
- 2023-05-26T07:32:51Z
- 2023-05-26T07:32:51.123Z
- 2023-05-26T07:32:51+05:30
- 2023-05-26T07:32:51.123+05:30

Here are some examples of _invalid_ date-time values for the qot tool:

- 23-05-26 (the year must have four digits)
- 2023/05/26 (the separators must be hyphens)
- 2023-05-26T073251 (the time parts must have colons)

## How to use spaces in command line arguments for `qot` tool on Windows?

If the command line arguments contain spaces, we may encounter this issue on Windows with the login `Abhishek Kumar`.

```
PS D:\> qot --select "sum('Number of employees')" --from ".\organizations.csv" --where "Country=India"
'C:\Users\Abhishek' is not recognized as an internal or external command,
operable program or batch file.
```

The problem is that the command line interpreter is trying to execute `C:\Users\Abhishek` as a separate command, because it sees a space after `Abhishek`. This causes an error because there is no such command. The space is part of the path to the `qot` command, which is a tool that allows you to query data from tables or sheets.

The possible solution is to use double dots (`..`) instead of spaces in the command line arguments that contain spaces. This tells the `qot` tool to treat the double dots as spaces when parsing the arguments. For example, if you want to select the sum of the `Number of employees` column from the `organizations.csv` file where the `Country` column is equal to `India`, you can use the following command:

```cmd
qot --select "sum('Number..of..employees')" --from ".\organizations.csv" --where "Country..=..India"
```

This way, the command line interpreter will not split the arguments at spaces, and the `qot` tool will replace the double dots with spaces when processing the query. This will avoid similar kind of path with space error, even after enclosing the string with spaces.
