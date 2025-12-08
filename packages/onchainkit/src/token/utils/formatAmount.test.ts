import { describe, expect, it } from 'vitest';
/**
 * @vitest-environment node
 */
import type { FormatAmountOptions } from '../types';
import { formatAmount } from './formatAmount';

describe('formatAmount', () => {
  it('should return with commas with default options', () => {
    expect(formatAmount('12')).toEqual('12');
    expect(formatAmount('123')).toEqual('123');
    expect(formatAmount('1234')).toEqual('1,234');
    expect(formatAmount('12345')).toEqual('12,345');
    expect(formatAmount('123456')).toEqual('123,456');
    expect(formatAmount('1234567')).toEqual('1,234,567');
    expect(formatAmount('12345678')).toEqual('12,345,678');
    expect(formatAmount('123456789')).toEqual('123,456,789');
    expect(formatAmount('1234567890')).toEqual('1,234,567,890');
  });

  it('should format decimals with minimum of 2 and maximum of 4 fraction digits', () => {
    const options = {
      locale: 'en-US',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    } as FormatAmountOptions;
    expect(formatAmount('123.1', options)).toEqual('123.10');
    expect(formatAmount('123.01', options)).toEqual('123.01');
    expect(formatAmount('123.012', options)).toEqual('123.012');
    expect(formatAmount('123.0123', options)).toEqual('123.0123');
    expect(formatAmount('123.01234', options)).toEqual('123.0123');
    expect(formatAmount('123.01236', options)).toEqual('123.0124');
    expect(formatAmount('123.00001', options)).toEqual('123.00');
  });

  it('should return with period and 2 decimal point for EU countries like Germany', () => {
    const options = {
      locale: 'de-DE',
      minimumFractionDigits: 2,
    } as FormatAmountOptions;
    expect(formatAmount('12', options)).toEqual('12,00');
    expect(formatAmount('123', options)).toEqual('123,00');
    expect(formatAmount('1234', options)).toEqual('1.234,00');
    expect(formatAmount('12345', options)).toEqual('12.345,00');
    expect(formatAmount('123456', options)).toEqual('123.456,00');
    expect(formatAmount('1234567', options)).toEqual('1.234.567,00');
    expect(formatAmount('12345678', options)).toEqual('12.345.678,00');
    expect(formatAmount('123456789', options)).toEqual('123.456.789,00');
    expect(formatAmount('1234567890', options)).toEqual('1.234.567.890,00');
  });

  it('should return an empty string if amount is undefined', () => {
    expect(formatAmount(undefined)).toEqual('');
  });
});
