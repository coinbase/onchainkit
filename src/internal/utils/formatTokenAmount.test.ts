import { formatTokenAmount } from './formatTokenAmount';

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
