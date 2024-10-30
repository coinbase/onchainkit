import { describe, expect, it } from 'vitest';
/**
 * @vitest-environment node
 */
import { DEGEN_TOKEN, ETH_TOKEN } from '../../swap/mocks';
import { getAPIParamsForToken } from './getAPIParamsForToken';

describe('getAPIParamsForToken', () => {
  it('should return the correct GetQuoteAPIParams object', () => {
    const from = ETH_TOKEN;
    const to = DEGEN_TOKEN;
    const amount = '1.5';
    const amountReference = 'from';
    const expectedParams = {
      from: 'ETH',
      to: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
      amount: '1500000000000000000',
      amountReference: 'from',
    };
    const result = getAPIParamsForToken({
      useAggregator: true,
      from,
      to,
      amount,
      amountReference,
    });
    expect(result).toEqual(expectedParams);
  });

  it('should use the default for amountReference', () => {
    const from = ETH_TOKEN;
    const to = DEGEN_TOKEN;
    const amount = '1.5';
    const expectedParams = {
      from: 'ETH',
      to: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
      amount: '1500000000000000000',
      amountReference: 'from',
    };
    const result = getAPIParamsForToken({
      useAggregator: true,
      from,
      to,
      amount,
    });
    expect(result).toEqual(expectedParams);
  });

  it('should format the amount correctly with default decimals when isAmountInDecimals is true', () => {
    const to = ETH_TOKEN;
    const from = DEGEN_TOKEN;
    const amount = '1500000000000000000';
    const amountReference = 'from';
    const isAmountInDecimals = true;
    const expectedParams = {
      from: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
      to: 'ETH',
      amount: '1500000000000000000',
      amountReference: 'from',
    };
    const result = getAPIParamsForToken({
      useAggregator: true,
      from,
      to,
      amount,
      amountReference,
      isAmountInDecimals,
    });
    expect(result).toEqual(expectedParams);
  });

  it('should format the amount correctly with default decimals when isAmountInDecimals is false', () => {
    const to = ETH_TOKEN;
    const from = DEGEN_TOKEN;
    const amount = '1.5';
    const amountReference = 'from';
    const expectedParams = {
      from: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
      to: 'ETH',
      amount: '1500000000000000000',
      amountReference: 'from',
    };
    const result = getAPIParamsForToken({
      useAggregator: true,
      from,
      to,
      amount,
      amountReference,
    });
    expect(result).toEqual(expectedParams);
  });

  it('should return an error if amount is negative', () => {
    const to = ETH_TOKEN;
    const from = DEGEN_TOKEN;
    const amount = '-1';
    const amountReference = 'from';
    const result = getAPIParamsForToken({
      useAggregator: true,
      from,
      to,
      amount,
      amountReference,
    });
    expect(result).toEqual({
      code: 'INVALID_INPUT',
      error: 'Invalid input: amount must be a non-negative number string',
      message: '',
    });
  });

  it('should return an error if amount is empty', () => {
    const to = ETH_TOKEN;
    const from = DEGEN_TOKEN;
    const amount = '';
    const amountReference = 'from';
    const result = getAPIParamsForToken({
      useAggregator: true,
      from,
      to,
      amount,
      amountReference,
    });
    expect(result).toEqual({
      code: 'INVALID_INPUT',
      error: 'Invalid input: amount must be a non-empty string',
      message: '',
    });
  });

  it('should return an error if decimals is not an integer', () => {
    const to = ETH_TOKEN;
    const from = {
      ...DEGEN_TOKEN,
      decimals: 1.1,
    };
    const amount = '1';
    const amountReference = 'from';
    const result = getAPIParamsForToken({
      useAggregator: true,
      from,
      to,
      amount,
      amountReference,
    });
    expect(result).toEqual({
      code: 'INVALID_INPUT',
      error: 'Invalid input: decimals must be a non-negative integer',
      message: '',
    });
  });
});
