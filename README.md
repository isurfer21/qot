# qot
Query over Table (QoT) CLI can be used to query over CSV

## Usage

```
$ qot --help
QoT - Query over Table

Syntax:
  qot (--help | -h)
  qot (--version | -v)
  qot -select <columns> -from <filepath> -where <condition>
  qot -select <columns> -from <filepath> -where <condition> -count <number> -orderby <column> (-asc | -desc)
  qot -select <columns> -from <filepath> -where <condition> (-and <condition> | -or <condition>)*

Options:
  -h --help             Help description
  -v --version          Version information
  -select <columns>     Select columns to display
  -from <filepath>      File path of table or sheet
  -where <condition>    Filter condition
    -and <condition>
    -or <condition>
  -count <rows>         Number of rows to display
  -orderby <column>     Order by column
    -asc                Sort in ascending order
    -desc               Sort in descending order

Usage:
  qot -select firstname,lastname,mobile,email -from 'sample.csv' -where 'age < 30' -count 10 -orderby age -desc
  qot -select=firstname,age,email -from='sample.csv' -where='age < 30' -count=10 -orderby=age -asc
  qot -select:firstname,mobile -from:'sample.csv' -where:'age < 30' -count:10 -orderby:age -desc

```

## Working

This program uses the `csv-parse` and `yargs` modules to parse CSV data and command-line arguments, respectively. The program filters the data based on the conditions specified by the `-where`, `-and`, and `-or` options and sorts the data based on the column specified by the `-orderby` option. The program also limits the number of rows displayed based on the value specified by the `-count` option.

You can run this program from the command line by passing the appropriate arguments. For example:

```
node qot.js -select firstname,lastname,mobile,email -from sample.csv -where age<30 -count10 -orderby age -desc
```

This command will select the `firstname`, `lastname`, `mobile`, and `email` columns from the `sample.csv` file where the `age` is less than `30`. The results will be sorted by `age` in descending order and only the first `10` rows will be displayed.
