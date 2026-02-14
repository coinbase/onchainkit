import { describe, expect, it } from 'vitest';
import { formatPercent } from './formatPercent';

describe('formatPercent', () => {
  describe('basic formatting', () => {
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
  });

  describe('negative numbers', () => {
    it('handles negative percentages', () => {
      expect(formatPercent(-0.1234)).toBe('-12.34%');
      expect(formatPercent(-1)).toBe('-100.00%');
    });

    it('handles small negative numbers', () => {
      expect(formatPercent(-0.0001)).toBe('-0.01%');
      expect(formatPercent(-0.00001)).toBe('0.00%');
    });
  });

  describe('numbers greater than 1', () => {
    it('handles values greater than 100%', () => {
      expect(formatPercent(1.234)).toBe('123.40%');
      expect(formatPercent(12.34)).toBe('1,234.00%');
    });

    it('handles very large values', () => {
      expect(formatPercent(100)).toBe('10,000.00%');
      expect(formatPercent(1000)).toBe('100,000.00%');
    });
  });

  describe('edge cases', () => {
    it('handles very small positive numbers', () => {
      expect(formatPercent(0.0001)).toBe('0.01%');
      expect(formatPercent(0.00001)).toBe('0.00%');
      expect(formatPercent(0.00005)).toBe('0.01%');
    });

    it('handles numbers very close to zero', () => {
      expect(formatPercent(0.000001)).toBe('0.00%');
      expect(formatPercent(-0.000001)).toBe('0.00%');
    });

    it('handles decimal places of 0', () => {
      expect(formatPercent(0.5, 0)).toBe('50%');
      expect(formatPercent(0.555, 0)).toBe('56%');
    });

    it('handles high precision decimal places', () => {
      expect(formatPercent(0.123456789, 6)).toBe('12.345679%');
      expect(formatPercent(0.123456789, 8)).toBe('12.34567890%');
    });

    it('handles rounding correctly', () => {
      expect(formatPercent(0.12345)).toBe('12.35%');
      expect(formatPercent(0.12344)).toBe('12.34%');
    });
  });

  describe('special values', () => {
    it('handles Infinity', () => {
      expect(formatPercent(Number.POSITIVE_INFINITY)).toBe('∞%');
    });

    it('handles negative Infinity', () => {
      expect(formatPercent(Number.NEGATIVE_INFINITY)).toBe('-∞%');
    });

    it('handles NaN', () => {
      expect(formatPercent(Number.NaN)).toBe('NaN%');
    });
  });
});

