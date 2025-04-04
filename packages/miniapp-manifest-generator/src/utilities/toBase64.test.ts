import { describe, it, expect } from 'vitest';
import { toBase64Url } from './toBase64';

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
