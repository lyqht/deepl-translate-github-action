import { describe, expect, test } from "vitest";
import { removeKeepTagsFromString, replaceAll, replaceParameterStringsInJSONValueWithKeepTags } from '../src/utils'

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

describe('replaceParameterStringsInJSONValueWithKeepTags', () => {
  test('Should properly wrap {} and {{}} strings with keep tags', () => {
    const input = 'Hello {World} and {{Universe}}';
    const expectedOutput = 'Hello <keep>{World}</keep> and <keep>{{Universe}}</keep>';

    expect(replaceParameterStringsInJSONValueWithKeepTags(input)).toEqual(expectedOutput);
  });

  test('Should handle empty {} and {{}}', () => {
    const input = '{} and {{}}';
    const expectedOutput = '<keep>{}</keep> and <keep>{{}}</keep>';

    expect(replaceParameterStringsInJSONValueWithKeepTags(input)).toEqual(expectedOutput);
  });

  test('Should not modify strings without {} or {{}}', () => {
    const input = 'Hello World!';
    expect(replaceParameterStringsInJSONValueWithKeepTags(input)).toEqual(input);
  });

  test('Should handle strings with multiple {} and {{}}', () => {
    const input = '{Hello} {World} and {{Universe}}';
    const expectedOutput = '<keep>{Hello}</keep> <keep>{World}</keep> and <keep>{{Universe}}</keep>';

    expect(replaceParameterStringsInJSONValueWithKeepTags(input)).toEqual(expectedOutput);
  });
});

