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