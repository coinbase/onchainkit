import { describe, expect, it } from 'vitest';
import { getTruncatedAmount } from './getTruncatedAmount';

describe('getTruncatedAmount', () => {
  it('rounds to specified decimal places', () => {
    expect(getTruncatedAmount('0.0002851826238227', 5)).toBe('0.00028');
    expect(getTruncatedAmount('1.23456789', 2)).toBe('1.23');
  });

  it('preserves exact decimal places when shorter than max', () => {
    expect(getTruncatedAmount('123.456', 10)).toBe('123.456');
    expect(getTruncatedAmount('0.01', 2)).toBe('0.01');
  });

  it('handles zero correctly', () => {
    expect(getTruncatedAmount('0', 2)).toBe('0');
  });

  it('formats thousands with commas', () => {
    expect(getTruncatedAmount('1234567.89', 2)).toBe('1,234,567.89');
    expect(getTruncatedAmount('1000000', 0)).toBe('1,000,000');
  });

  it('handles very small numbers', () => {
    expect(getTruncatedAmount('0.00004', 4)).toBe('0');
    expect(getTruncatedAmount('0.000006', 6)).toBe('0.000006');
  });

  it('removes trailing zeros for whole numbers', () => {
    expect(getTruncatedAmount('123.00', 2)).toBe('123');
    expect(getTruncatedAmount('1000.0', 1)).toBe('1,000');
  });

  it('does not round up and show a higher value than the original', () => {
    expect(getTruncatedAmount('123.456789', 2)).toBe('123.45');
    expect(getTruncatedAmount('1234567.899', 2)).toBe('1,234,567.89');
  });
});
