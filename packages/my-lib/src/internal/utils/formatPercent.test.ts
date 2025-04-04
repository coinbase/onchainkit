import { describe, expect, it } from 'vitest';
import { formatPercent } from './formatPercent';

describe('formatPercent', () => {
  it('formats decimal to percentage with default 2 decimals', () => {
    expect(formatPercent(0.1234)).toBe('12.34%');
    expect(formatPercent(0)).toBe('0.00%');
    expect(formatPercent(1)).toBe('100.00%');
  });

  it('handles custom decimal places', () => {
    expect(formatPercent(0.1234, 3)).toBe('12.340%');
    expect(formatPercent(0.1234, 1)).toBe('12.3%');
    expect(formatPercent(0.1234, 0)).toBe('12%');
  });

  it('handles negative numbers', () => {
    expect(formatPercent(-0.1234)).toBe('-12.34%');
    expect(formatPercent(-1)).toBe('-100.00%');
  });

  it('handles numbers greater than 1', () => {
    expect(formatPercent(1.234)).toBe('123.40%');
    expect(formatPercent(12.34)).toBe('1,234.00%');
  });
});
