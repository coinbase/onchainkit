import { describe, it, expect } from 'vitest';
import { validateUrl } from './validateUrl';

describe('validateUrl', () => {
  it('should accept empty string', () => {
    expect(validateUrl('')).toBe(true);
  });

  it('should accept valid HTTPS URLs', () => {
    expect(validateUrl('https://example.com')).toBe(true);
    expect(validateUrl('https://sub.example.com')).toBe(true);
    expect(validateUrl('https://example.co.uk')).toBe(true);
    expect(validateUrl('https://example.com/path')).toBe(true);
    expect(validateUrl('https://example.com/path/')).toBe(true);
    expect(validateUrl('https://example.com/path/to/resource')).toBe(true);
  });

  it('should reject invalid URLs', () => {
    expect(validateUrl('http://example.com')).toBe(false);
    expect(validateUrl('ftp://example.com')).toBe(false);
    expect(validateUrl('example.com')).toBe(false);
    expect(validateUrl('not-a-url')).toBe(false);
    expect(validateUrl('https://')).toBe(false);
    expect(validateUrl('https://.com')).toBe(false);
    expect(validateUrl('https://example.')).toBe(false);
    expect(validateUrl('https://example.c')).toBe(false);
  });

  it('should handle special characters in paths', () => {
    expect(validateUrl('https://example.com/path-with-dashes')).toBe(true);
    expect(validateUrl('https://example.com/path_with_underscores')).toBe(true);
    expect(validateUrl('https://example.com/path.with.dots')).toBe(true);
  });
});
