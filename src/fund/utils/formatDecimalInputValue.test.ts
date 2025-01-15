import { describe, expect, it } from 'vitest';
import { formatDecimalInputValue } from './formatDecimalInputValue';

describe('formatDecimalInputValue', () => {
  it('adds a decimal point if the value starts with zero and is not decimal', () => {
    expect(formatDecimalInputValue('01')).toBe('0.1');
  });

  it('returns the value as is if already properly formatted', () => {
    expect(formatDecimalInputValue('0.1')).toBe('0.1');
    expect(formatDecimalInputValue('1.23')).toBe('1.23');
  });

  it('handles empty string input', () => {
    expect(formatDecimalInputValue('')).toBe('');
  });

  it('handles single zero input', () => {
    expect(formatDecimalInputValue('0')).toBe('0');
  });
});
