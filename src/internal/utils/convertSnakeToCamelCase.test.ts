import { describe, expect, it } from 'vitest';
import { convertSnakeToCamelCase } from './convertSnakeToCamelCase';

describe('convertSnakeToCamelCase', () => {
  it('should convert snake_case keys to camelCase', () => {
    expect(
      convertSnakeToCamelCase({ hello_world: 'hello_world' }),
    ).toStrictEqual({ helloWorld: 'hello_world' });
  });

  it('should handle keys with multiple underscores', () => {
    expect(
      convertSnakeToCamelCase({ this_is_a_test: 'this_is_a_test' }),
    ).toStrictEqual({ thisIsATest: 'this_is_a_test' });
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
    expect(convertSnakeToCamelCase(input)).toStrictEqual(expected);
  });

  it('should not convert elements of an array from snake_case to camelCase', () => {
    const input = ['hello_world', 'this_is_a_test'];
    const expected = ['hello_world', 'this_is_a_test'];
    expect(convertSnakeToCamelCase(input)).toStrictEqual(expected);
  });

  it('should convert keys of objects within an array from snake_case to camelCase', () => {
    const input = [
      { hello_world: 'value' },
      { nested_object: { inner_key: 'inner_value' } },
    ];
    const expected = [
      { helloWorld: 'value' },
      { nestedObject: { innerKey: 'inner_value' } },
    ];
    expect(convertSnakeToCamelCase(input)).toStrictEqual(expected);
  });

  it('should handle null values', () => {
    expect(convertSnakeToCamelCase(null)).toBeNull();
  });

  it('should handle undefined values', () => {
    expect(convertSnakeToCamelCase(undefined)).toBeUndefined();
  });

  it('should handle nested arrays within objects', () => {
    const input = { array_key: [{ nested_key: 'value' }] };
    const expected = { arrayKey: [{ nestedKey: 'value' }] };
    expect(convertSnakeToCamelCase(input)).toStrictEqual(expected);
  });

  it('should handle empty objects', () => {
    expect(convertSnakeToCamelCase({})).toStrictEqual({});
  });

  it('should handle empty arrays', () => {
    expect(convertSnakeToCamelCase([])).toStrictEqual([]);
  });

  it('should handle objects with non-string keys', () => {
    const input = { 123: 'value', symbol_key: 'value' };
    const expected = { 123: 'value', symbolKey: 'value' };
    expect(convertSnakeToCamelCase(input)).toEqual(expected);
  });
});
