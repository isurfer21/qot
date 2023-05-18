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
        where: "",
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
    }
  ];

  // Set the filepath of sample data in '.csv' format
  const fromCsv = path.join('__test__', 'data', 'people.csv');

  // Write a test for each test case using the test() function
  testCases.forEach(testCase => {
    test(`Query spreadsheet "SELECT ${testCase.input.select} WHERE ${testCase.input.where}"`, async () => {
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
