import { describe, expect, test } from "vitest";
import { removeKeepTagsFromString, replaceAll } from './utils';

describe('replaceAll', () => {
  test('should replace all occurrences of a substring in a string', () => {
    const str = 'hello world';
    const search = 'l';
    const replacement = 'x';
    const expected = 'hexxo worxd';
    const result = replaceAll(str, search, replacement);
    expect(result).toEqual(expected);
  });

  test('should return the original string if the search string is not found', () => {
    const str = 'hello world';
    const search = 'z';
    const replacement = 'x';
    const expected = 'hello world';
    const result = replaceAll(str, search, replacement);
    expect(result).toEqual(expected);
  });
});

describe('removeKeepTagsFromString', () => {
  test('should remove all <keep> and </keep> tags from a string', () => {
    const str = 'hello <keep>world</keep>';
    const expected = 'hello world';
    const result = removeKeepTagsFromString(str);
    expect(result).toEqual(expected);
  });

  test('should return the original string if it does not contain <keep> tags', () => {
    const str = 'hello world';
    const expected = 'hello world';
    const result = removeKeepTagsFromString(str);
    expect(result).toEqual(expected);
  });
});
