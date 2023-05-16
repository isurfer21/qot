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

  test('Query CSV', async () => {
    // Run a command in a shell using exec
    const fromCsv = path.join('__test__', 'data', 'people.csv');
    const selectColumn = "'First Name', 'Last Name', Sex as Gender";
    const whereClause = "'Job Title'='Market researcher'";
    const { stdout, stderr } = await $(
      `node index.js --select "${selectColumn}" --from "${fromCsv}" --where "${whereClause}" --limit 10 --json`
    );
    // Check for stderr
    if (!!stderr) {
      expect(() => {
        throw new Error(stderr);
      }).toThrow();
    }
    // Expect the standard output to match query output
    expect(JSON.parse(stdout)).toEqual([
      {
        'First Name': 'Yesenia',
        'Last Name': 'Martinez',
        Gender: 'Male'
      }
    ]);
  });
});
