import { describe, expect, test } from '@jest/globals';
import Utility from '../../lib/utility';

describe('Utility', () => {
  test('dualDotToSpace should convert double dots to spaces in a string', () => {
    // Arrange
    const input = 'Hello..world..this..is..a..test';
    const expected = 'Hello world this is a test';

    // Act
    const result = Utility.dualDotToSpace(input);

    // Assert
    expect(result).toBe(expected);
  });

  test('dualDotToSpace should not change a string without double dots', () => {
    // Arrange
    const input = 'This is a normal string';
    const expected = 'This is a normal string';

    // Act
    const result = Utility.dualDotToSpace(input);

    // Assert
    expect(result).toBe(expected);
  });

  test('dualDotToSpace should not change an empty string', () => {
    // Arrange
    const input = '';
    const expected = '';

    // Act
    const result = Utility.dualDotToSpace(input);

    // Assert
    expect(result).toBe(expected);
  });
});
