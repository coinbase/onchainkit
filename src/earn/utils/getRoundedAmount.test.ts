import { describe, expect, it } from 'vitest';
import { getRoundedAmount } from './getRoundedAmount';

describe('getRoundedAmount', () => {
  it('rounds to specified decimal places', () => {
    expect(getRoundedAmount('0.0002851826238227', 5)).toBe('0.00029');
    expect(getRoundedAmount('1.23456789', 2)).toBe('1.23');
  });

  it('preserves exact decimal places when shorter than max', () => {
    expect(getRoundedAmount('123.456', 10)).toBe('123.456');
    expect(getRoundedAmount('0.01', 2)).toBe('0.01');
  });

  it('handles zero correctly', () => {
    expect(getRoundedAmount('0', 2)).toBe('0');
  });

  it('formats thousands with commas', () => {
    expect(getRoundedAmount('1234567.89', 2)).toBe('1,234,567.89');
    expect(getRoundedAmount('1000000', 0)).toBe('1,000,000');
  });

  it('handles very small numbers', () => {
    expect(getRoundedAmount('0.00004', 4)).toBe('0');
    expect(getRoundedAmount('0.00006', 4)).toBe('0.0001');
  });

  it('removes trailing zeros for whole numbers', () => {
    expect(getRoundedAmount('123.00', 2)).toBe('123');
    expect(getRoundedAmount('1000.0', 1)).toBe('1,000');
  });
});
