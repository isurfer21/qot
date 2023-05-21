import { describe, expect, test } from '@jest/globals';
import Trimmer from '../../lib/trimmer';

describe('Trimmer', () => {
  test('trim should remove leading and trailing characters', () => {
    expect(Trimmer.trim('***Hello***', '*')).toBe('Hello');
    expect(Trimmer.trim('   World   ', ' ')).toBe('World');
    expect(Trimmer.trim('!!!Wow!!!', '!')).toBe('Wow');
  });

  test('trim should return the original string if no characters are removed', () => {
    expect(Trimmer.trim('Hello', 'x')).toBe('Hello');
    expect(Trimmer.trim('', '*')).toBe('');
    expect(Trimmer.trim(' ', ' ')).toBe('');
  });

  test('trimAny should remove leading and trailing characters from a set', () => {
    expect(Trimmer.trimAny('abcde', 'ae')).toBe('bcd');
    expect(Trimmer.trimAny('[Hello]', '[]')).toBe('Hello');
    expect(Trimmer.trimAny('(World)', '()')).toBe('World');
  });

  test('trimAny should return the original string if no characters are removed', () => {
    expect(Trimmer.trimAny('Hello', 'x')).toBe('Hello');
    expect(Trimmer.trimAny('', 'ae')).toBe('');
    expect(Trimmer.trimAny('[', '[]')).toBe('');
  });

  test('hasSubstringAt should return true if a substring is found at a position', () => {
    expect(Trimmer.hasSubstringAt('Hello', 'el', 1)).toBe(true);
    expect(Trimmer.hasSubstringAt('World', 'ld', 3)).toBe(true);
    expect(Trimmer.hasSubstringAt('Wow', 'ow', 1)).toBe(true);
  });

  test('hasSubstringAt should return false if a substring is not found at a position', () => {
    expect(Trimmer.hasSubstringAt('Hello', 'el', 2)).toBe(false);
    expect(Trimmer.hasSubstringAt('World', 'ld', 4)).toBe(false);
    expect(Trimmer.hasSubstringAt('Wow', 'ow', 0)).toBe(false);
  });

  test('trimWord should remove leading and trailing occurrences of a word', () => {
    expect(Trimmer.trimWord('foofooHellofoofoo', 'foo')).toBe('Hello');
    expect(Trimmer.trimWord('barbarWorldbarbar', 'bar')).toBe('World');
    expect(Trimmer.trimWord('bazbazWowbazbaz', 'baz')).toBe('Wow');
  });

  test('trimWord should return the original string if no words are removed', () => {
    expect(Trimmer.trimWord('Hello', 'foo')).toBe('Hello');
    expect(Trimmer.trimWord('', 'bar')).toBe('');
    expect(Trimmer.trimWord('baz', 'baz')).toBe('');
  });
});
