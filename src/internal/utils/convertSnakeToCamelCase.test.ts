import { describe, expect, it } from 'vitest';
import { convertSnakeToCamelCase } from './convertSnakeToCamelCase';

describe('convertSnakeToCamelCase', () => {
  it('should convert snake_case to camelCase', () => {
    expect(convertSnakeToCamelCase('hello_world')).toBe('helloWorld');
  });

  it('should handle strings with multiple underscores', () => {
    expect(convertSnakeToCamelCase('this_is_a_test')).toBe('thisIsATest');
  });

  it('should return an empty string if input is empty', () => {
    expect(convertSnakeToCamelCase('')).toBe('');
  });

  it('should convert keys of an object from snake_case to camelCase', () => {
    const input = {
      hello_world: 'value',
      nested_object: { inner_key: 'innerValue' },
    };
    const expected = {
      helloWorld: 'value',
      nestedObject: { innerKey: 'innerValue' },
    };
    expect(convertSnakeToCamelCase(input)).toEqual(expected);
  });

  it('should convert elements of an array from snake_case to camelCase', () => {
    const input = ['hello_world', 'this_is_a_test'];
    const expected = ['helloWorld', 'thisIsATest'];
    expect(convertSnakeToCamelCase(input)).toEqual(expected);
  });

  it('should convert keys of objects within an array from snake_case to camelCase', () => {
    const input = [
      { hello_world: 'value' },
      { nested_object: { inner_key: 'innerValue' } },
    ];
    const expected = [
      { helloWorld: 'value' },
      { nestedObject: { innerKey: 'innerValue' } },
    ];
    expect(convertSnakeToCamelCase(input)).toEqual(expected);
  });
});
