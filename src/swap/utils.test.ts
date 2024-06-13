import { formatTokenAmount, isSwapError, isValidAmount } from './utils'; // Adjust the import path as needed

describe('isValidAmount', () => {
  it('should return true for an empty string', () => {
    expect(isValidAmount('')).toBe(true);
  });

  it('should return true for a valid number string with less than 11 characters', () => {
    expect(isValidAmount('12345')).toBe(true);
  });

  it('should return false for a number string with more than 11 characters', () => {
    expect(isValidAmount('123456789012')).toBe(false);
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

describe('isSwapError function', () => {
  it('returns true for a valid SwapError object', () => {
    const response = {
      error: 'Swap failed',
      details: 'Insufficient balance',
    };

    expect(isSwapError(response)).toBe(true);
  });

  it('returns false for null or non-object inputs', () => {
    expect(isSwapError(null)).toBe(false);
    expect(isSwapError(undefined)).toBe(false);
    expect(isSwapError('error')).toBe(false);
    expect(isSwapError(123)).toBe(false);
  });

  it('returns false for objects without the "error" property', () => {
    const response = {
      message: 'An error occurred',
    };

    expect(isSwapError(response)).toBe(false);
  });

  it('returns false for empty objects', () => {
    const response = {};

    expect(isSwapError(response)).toBe(false);
  });
});

describe('formatTokenAmount', () => {
  test('formats amount correctly with 18 decimals', () => {
    const amount = '100000000000000000';
    const decimals = 18;
    const formattedAmount = formatTokenAmount(amount, decimals);
    expect(formattedAmount).toBe('0.1');
  });

  test('formats amount correctly with different decimals', () => {
    const amount = '1000000000';
    const decimals = 9;
    const formattedAmount = formatTokenAmount(amount, decimals);
    expect(formattedAmount).toBe('1');
  });

  test('rounds to a maximum of 11 significant digits', () => {
    const amount = '16732157880511600003860';
    const decimals = 18;
    const formattedAmount = formatTokenAmount(amount, decimals);
    expect(formattedAmount).toBe('16732.157881');
  });

  test('handles very small amounts correctly', () => {
    const amount = '1';
    const decimals = 18;
    const formattedAmount = formatTokenAmount(amount, decimals);
    expect(formattedAmount).toBe('1e-18');
  });

  test('handles zero amount correctly', () => {
    const amount = '0';
    const decimals = 18;
    const formattedAmount = formatTokenAmount(amount, decimals);
    expect(formattedAmount).toBe('0');
  });

  test('handles large amounts correctly', () => {
    const amount = '1000000000000000000000000000';
    const decimals = 18;
    const formattedAmount = formatTokenAmount(amount, decimals);
    expect(formattedAmount).toBe('1000000000');
  });
});
