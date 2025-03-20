import { describe, expect, it } from 'vitest';
import { isValidAmount } from './isValidAmount';

describe('isValidAmount', () => {
  it('should return true for an empty string', () => {
    expect(isValidAmount('')).toBe(true);
  });

  it('should return true for a valid number string with a decimal point', () => {
    expect(isValidAmount('123.45')).toBe(true);
  });

  it('should return false for a string with multiple decimal points', () => {
    expect(isValidAmount('123.45.67')).toBe(false);
  });

  it('should return false for a string with non-numeric characters', () => {
    expect(isValidAmount('123a45')).toBe(false);
  });

  it('should return true for a valid number string with no integer part but a decimal point', () => {
    expect(isValidAmount('.12345')).toBe(true);
  });

  it('should return true for a valid number string with no decimal part', () => {
    expect(isValidAmount('12345.')).toBe(true);
  });

  it('should return false for a string with spaces', () => {
    expect(isValidAmount('123 45')).toBe(false);
  });
});
