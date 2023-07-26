import { describe, expect, test, vi } from "vitest";
import { applyRecursive, removeKeepTagsFromString, replaceAll, replaceParameterStringsInJSONValueWithKeepTags } from '../src/utils'

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

describe('applyRecursive', () => {
  test('should append "translated" to all string values', async () => {
    const input = {
        a: {
            b: "test",
            c: "test2"
        },
        d: "test3"
    };
    const expected = {
        a: {
            b: "testtranslated",
            c: "test2translated"
        },
        d: "test3translated"
    };
    const operation = async (value: string, path: string[]) => {
        let obj = input;
        for (let key of path) {
            if(typeof obj[key] === "string") {
                obj[key] += "translated";
            }
            obj = obj[key];
        }
    };

    await applyRecursive(input, [], operation, []);

    expect(input).toEqual(expected);
});


  test('should pass correct arguments to operation', async () => {
    const input = { a: "test" };
    const operationArgs = [1, 2, 3];
    const operation = vi.fn();

    await applyRecursive(input, [], operation, operationArgs);

    expect(operation).toHaveBeenCalledWith("test", ["a"], ...operationArgs);
  });

  // Here you can add more test cases according to your requirements
});
