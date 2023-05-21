import { describe, expect, test } from '@jest/globals';
import path from 'node:path';
import { promisify } from 'node:util';
import { exec } from 'node:child_process';

const $ = promisify(exec);

describe('Main', () => {
  // Write a test case using the test() function
  test('Check version', async () => {
    // Run a command in a shell using exec
    const { stdout, stderr } = await $('node index.js -v');
    // Check for stderr
    if (!!stderr) {
      expect(() => {
        throw new Error(stderr);
      }).toThrow();
    }
    // Expect the standard output to match app version
    expect(stdout).toMatch(/QoT version \d\.\d\.\d/gm);
  });

  // Define some test cases with input and expected output
  const testCases = [
    {
      input: {
        select: "'First Name', 'Last Name', Sex as Gender",
        from: 'people.csv',
        where: "'Job Title'='Market researcher'",
        limit: 1
      },
      output: [
        {
          'First Name': 'Yesenia',
          'Last Name': 'Martinez',
          'Gender': 'Male'
        }
      ]
    },
    {
      input: {
        select: '*',
        from: 'people.csv',
        where: '`First Name`="Mario"',
        limit: 1
      },
      output: [
        {
          'Index': '86',
          'User Id': 'CB19EafEbBfF9eC',
          'First Name': 'Mario',
          'Last Name': 'Vaughn',
          'Sex': 'Male',
          'Email': 'oblake@example.com',
          'Phone': '160-144-5039x12276',
          'Date of birth': '1990-07-08',
          'Job Title': 'Research scientist (life sciences)'
        }
      ]
    },
    {
      input: {
        select: "'First Name', 'Last Name', Sex as Gender",
        from: 'people.csv',
        where: "Sex='Male' and 'First Name' not in ('Lori', 'Shelby', 'Erin')",
        limit: 5
      },
      output: [
        {
          'First Name': 'Kristine',
          'Last Name': 'Travis',
          'Gender': 'Male'
        },
        {
          'First Name': 'Yesenia',
          'Last Name': 'Martinez',
          'Gender': 'Male'
        },
        {
          'First Name': 'Ricardo',
          'Last Name': 'Hinton',
          'Gender': 'Male'
        },
        {
          'First Name': 'Dave',
          'Last Name': 'Farrell',
          'Gender': 'Male'
        },
        {
          'First Name': 'Isaiah',
          'Last Name': 'Downs',
          'Gender': 'Male'
        }
      ]
    },
    {
      input: {
        select: "'First Name', 'Last Name', COUNT(Sex) as Gender",
        from: 'people.csv',
        where: "Sex='Male'",
        limit: 100
      },
      output: [
        {
          'First Name': '-',
          'Last Name': '-',
          'Gender': 47
        }
      ]
    },
    {
      input: {
        select: "'First Name', 'Last Name', DISTINCT Sex as Gender",
        from: 'people.csv',
        where: '',
        limit: 10
      },
      output: [
        {
          'First Name': 'Shelby',
          'Last Name': 'Terrell',
          'Gender': 'Male'
        },
        {
          'First Name': 'Phillip',
          'Last Name': 'Summers',
          'Gender': 'Female'
        }
      ]
    },
    {
      input: {
        select: "Period, Mothers_Age, sum('Count')",
        from: 'births-by-mothers-age.csv',
        where: "Mothers_Age='Under 15'",
        limit: 10
      },
      output: [
        {
          'Period': '-',
          'Mothers_Age': '-',
          'SUM(Count)': 441
        }
      ]
    },
    {
      input: {
        select: "Period, Mothers_Age, max('Count')",
        from: 'births-by-mothers-age.csv',
        where: "Mothers_Age='Under 15'",
        limit: 10
      },
      output: [
        {
          'Period': '-',
          'Mothers_Age': '-',
          'MAX(Count)': 51
        }
      ]
    },
    {
      input: {
        select: "Period, Mothers_Age, 'Count'",
        from: 'births-by-mothers-age.csv',
        where: "Mothers_Age='Under 15' and Count > 30",
        limit: 10
      },
      output: [
        {
          Period: '2005',
          Mothers_Age: 'Under 15',
          Count: '36'
        },
        {
          Period: '2006',
          Mothers_Age: 'Under 15',
          Count: '36'
        },
        {
          Period: '2007',
          Mothers_Age: 'Under 15',
          Count: '51'
        },
        {
          Period: '2008',
          Mothers_Age: 'Under 15',
          Count: '39'
        }
      ]
    }
  ];

  // Write a test for each test case using the test() function
  testCases.forEach(testCase => {
    test(`Query spreadsheet "SELECT ${testCase.input.select} FROM ${testCase.input.from} WHERE ${testCase.input.where}"`, async () => {
      // Set the filepath of sample data in '.csv' format
      const fromCsv = path.join('__test__', 'data', testCase.input.from);
      // Run a command in a shell using exec
      const { stdout, stderr } = await $(
        `node index.js --select "${testCase.input.select}" --from "${fromCsv}" --where "${testCase.input.where}" --limit ${testCase.input.limit} --json`
      );
      // Check for stderr
      if (!!stderr) {
        expect(() => {
          throw new Error(stderr);
        }).toThrow();
      }
      // Expect the standard output to match query output
      expect(JSON.parse(stdout)).toEqual(testCase.output);
    });
  });
});
