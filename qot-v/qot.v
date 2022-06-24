module main

import os

fn version() string {
  return '0.0.1'
}

fn main() {
  args := os.args.clone()
  // println(args)
  argv := argument_parser(args)
  println(argv)
  if argv['help'] == '1' || argv['h'] == '1' {
    println("QoT - Query over Table

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
    ")
  } else if argv['version'] == '1' || argv['v'] == '1' {
    println('Version ${version()}')
  } else {
    if argv['from'] != '' {
      
    }
  }
}

fn argument_parser(args []string) map[string]string {
  mut list := map[string]string{}
  for i := 0; i < args.len; i++ {
    if i > 0 {
      if args[i].substr(0, 2) == '--' || args[i].substr(0, 1) == '-' {
        if args[i].contains(':') {
          arg := args[i].split(':')
          list[arg[0].trim_left('-')] = arg[1]
        } else if args[i].contains('=') {
          arg := args[i].split('=')
          list[arg[0].trim_left('-')] = arg[1]
        } else if i+1 < args.len && args[i+1].substr(0, 1) != '-'{
          list[args[i].trim_left('-')] = args[i+1]
          i++
        } else {
          list[args[i].trim_left('-')] = '1'
        }
      } else {
        list[args[i]] = ''
      }
    }
  }
  return list
}
