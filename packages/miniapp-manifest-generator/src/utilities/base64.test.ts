import { describe, it, expect } from 'vitest';
import { fromBase64Url, toBase64Url } from './base64';

describe('toBase64Url', () => {
  it('should encode basic strings', () => {
    expect(toBase64Url('hello')).toBe('aGVsbG8');
  });

  it('should handle empty string', () => {
    expect(toBase64Url('')).toBe('');
  });

  it('should handle special characters', () => {
    expect(toBase64Url('hello+world')).toBe('aGVsbG8rd29ybGQ');
  });

  it('should handle JSON strings', () => {
    const jsonStr = JSON.stringify({ key: 'value' });
    expect(toBase64Url(jsonStr)).toBe('eyJrZXkiOiJ2YWx1ZSJ9');
  });
});

describe('fromBase64Url', () => {
  it('should decode basic strings', () => {
    expect(fromBase64Url('aGVsbG8')).toBe('hello');
  });

  it('should handle empty string', () => {
    expect(fromBase64Url('')).toBe('');
  });

  it('should handle special characters', () => {
    expect(fromBase64Url('aGVsbG8rd29ybGQ')).toBe('hello+world');
  });

  it('should handle JSON strings', () => {
    const jsonStr = JSON.stringify({ key: 'value' });
    expect(fromBase64Url('eyJrZXkiOiJ2YWx1ZSJ9')).toBe(jsonStr);
  });
});
