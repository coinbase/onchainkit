import { formatDecimals } from './formatDecimals';

describe('formatDecimals', () => {
  it('should format the amount correctly with default decimals when inputInDecimals is true', () => {
    const amount = '1500000000000000000';
    const expectedFormattedAmount = '1.5';
    const result = formatDecimals(amount, true, 18);
    expect(result).toEqual(expectedFormattedAmount);
  });

  it('should format the amount correctly with custom decimals when inputInDecimals is true', () => {
    const amount = '1500000000000000000';
    const decimals = 9;
    const expectedFormattedAmount = '1500000000';
    const result = formatDecimals(amount, true, decimals);
    expect(result).toEqual(expectedFormattedAmount);
  });

  it('should format the amount correctly with default decimals when inputInDecimals is false', () => {
    const amount = '1.5';
    const expectedFormattedAmount = '1500000000000000000';
    const result = formatDecimals(amount, false, 18);
    expect(result).toEqual(expectedFormattedAmount);
  });

  it('should format the amount correctly with custom decimals when inputInDecimals is false', () => {
    const amount = '1.5';
    const decimals = 9;
    const expectedFormattedAmount = '1500000000';
    const result = formatDecimals(amount, false, decimals);
    expect(result).toEqual(expectedFormattedAmount);
  });

  it('should format the amount correctly with default decimals when inputInDecimals is true and decimals is not provided', () => {
    const amount = '1500000000000000000';
    const expectedFormattedAmount = '1.5';
    const result = formatDecimals(amount);
    expect(result).toEqual(expectedFormattedAmount);
  });

  it('should format the amount correctly with default decimals when inputInDecimals is true and decimals is provided', () => {
    const amount = '1500000000';
    const expectedFormattedAmount = '1.5';
    const decimals = 9;
    const result = formatDecimals(amount, true, decimals);
    expect(result).toEqual(expectedFormattedAmount);
  });

  it('should format the amount correctly with default decimals when inputInDecimals is false and decimals is provided', () => {
    const amount = '1.5';
    const expectedFormattedAmount = '1500000000';
    const decimals = 9;
    const result = formatDecimals(amount, false, decimals);
    expect(result).toEqual(expectedFormattedAmount);
  });

  it('should format the amount correctly with default decimals when inputInDecimals is false and decimals is not provided', () => {
    const amount = '1.5';
    const expectedFormattedAmount = '1.5e-18';
    const result = formatDecimals(amount);
    expect(result).toEqual(expectedFormattedAmount);
  });
});
