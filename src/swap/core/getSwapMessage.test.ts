/**
 * @vitest-environment node
 */
import { getSwapMessage, SwapMessage } from './getSwapMessage';
import {
  LOW_LIQUIDITY_ERROR_CODE,
  TOO_MANY_REQUESTS_ERROR_CODE,
  USER_REJECTED_ERROR_CODE,
} from '../constants';
import type { Token } from '../../token';
import { describe, expect, test, vi } from 'vitest';

const ETHToken: Token = {
  name: 'ETH',
  address: '',
  symbol: 'ETH',
  decimals: 18,
  image:
    'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
  chainId: 8453,
};

const USDCToken: Token = {
  name: 'USDC',
  address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  symbol: 'USDC',
  decimals: 6,
  image:
    'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
  chainId: 8453,
};

describe('getSwapMessage', () => {
  const baseParams = {
    error: undefined,
    from: {
      error: undefined,
      balance: '0',
      amount: '0',
      loading: false,
      token: undefined,
      setAmount: vi.fn(),
      setLoading: vi.fn(),
      setToken: vi.fn(),
    },
    to: {
      error: undefined,
      amount: '0',
      loading: false,
      token: undefined,
      setAmount: vi.fn(),
      setLoading: vi.fn(),
      setToken: vi.fn(),
    },
    loading: false,
  };

  test('returns BALANCE_ERROR when from or to has an error', () => {
    const params = {
      ...baseParams,
      from: {
        ...baseParams.from,
        error: { code: 'some_code', error: 'some error' },
      },
    };
    expect(getSwapMessage(params)).toBe(SwapMessage.BALANCE_ERROR);

    const params2 = {
      ...baseParams,
      to: {
        ...baseParams.to,
        error: { code: 'some_code', error: 'some error' },
      },
    };
    expect(getSwapMessage(params2)).toBe(SwapMessage.BALANCE_ERROR);
  });

  test('returns INSUFFICIENT_BALANCE when amount exceeds balance', () => {
    const params = {
      ...baseParams,
      from: { ...baseParams.from, balance: '10', amount: '20' },
    };
    expect(getSwapMessage(params)).toBe(SwapMessage.INSUFFICIENT_BALANCE);
  });

  test('returns CONFIRM IN WALLET when pending transaction', () => {
    const params = {
      ...baseParams,
      isTransactionPending: true,
    };
    expect(getSwapMessage(params)).toBe(SwapMessage.CONFIRM_IN_WALLET);
  });

  test('returns SWAP_IN_PROGRESS when loading is true', () => {
    const params = {
      ...baseParams,
      loading: true,
    };
    expect(getSwapMessage(params)).toBe(SwapMessage.SWAP_IN_PROGRESS);
  });

  test('returns FETCHING_QUOTE when to or from loading is true', () => {
    const params = {
      ...baseParams,
      from: { ...baseParams.from, loading: true },
    };
    expect(getSwapMessage(params)).toBe(SwapMessage.FETCHING_QUOTE);

    const params2 = {
      ...baseParams,
      to: { ...baseParams.to, loading: true },
    };
    expect(getSwapMessage(params2)).toBe(SwapMessage.FETCHING_QUOTE);
  });

  test('returns INCOMPLETE_FIELD when required fields are missing', () => {
    const params = {
      ...baseParams,
    };
    expect(getSwapMessage(params)).toBe(SwapMessage.INCOMPLETE_FIELD);

    const params2 = {
      ...baseParams,
      from: {
        ...baseParams.from,
        amount: '10',
        balance: '20',
        token: ETHToken,
      },
    };
    expect(getSwapMessage(params2)).toBe(SwapMessage.INCOMPLETE_FIELD);

    const params3 = {
      ...baseParams,
      to: { ...baseParams.to, amount: '10', token: USDCToken },
    };
    expect(getSwapMessage(params3)).toBe(SwapMessage.INCOMPLETE_FIELD);
  });

  test('returns TOO_MANY_REQUESTS when error code is TOO_MANY_REQUESTS_ERROR_CODE', () => {
    const params = {
      ...baseParams,
      from: { ...baseParams.from, balance: '10', amount: '5', token: ETHToken },
      to: { ...baseParams.to, amount: '5', token: USDCToken },
      error: {
        quoteError: {
          code: TOO_MANY_REQUESTS_ERROR_CODE,
          error: 'Too many requests error',
        },
      },
    };
    expect(getSwapMessage(params)).toBe(SwapMessage.TOO_MANY_REQUESTS);
  });

  test('returns LOW_LIQUIDITY when error code is LOW_LIQUIDITY_ERROR_CODE', () => {
    const params = {
      ...baseParams,
      from: { ...baseParams.from, balance: '10', amount: '5', token: ETHToken },
      to: { ...baseParams.to, amount: '5', token: USDCToken },
      error: {
        quoteError: {
          code: LOW_LIQUIDITY_ERROR_CODE,
          error: 'Low liquidity error',
        },
      },
    };
    expect(getSwapMessage(params)).toBe(SwapMessage.LOW_LIQUIDITY);
  });

  test('returns USER_REJECTED when error code is USER_REJECTED_ERROR_CODE', () => {
    const params = {
      ...baseParams,
      from: { ...baseParams.from, balance: '10', amount: '5', token: ETHToken },
      to: { ...baseParams.to, amount: '5', token: USDCToken },
      error: {
        quoteError: {
          code: USER_REJECTED_ERROR_CODE,
          error: 'User rejected error',
        },
      },
    };
    expect(getSwapMessage(params)).toBe(SwapMessage.USER_REJECTED);
  });

  test('returns the first error message when general error is present', () => {
    const params = {
      ...baseParams,
      from: { ...baseParams.from, balance: '10', amount: '5', token: ETHToken },
      to: { ...baseParams.to, amount: '5', token: USDCToken },
      error: {
        quoteError: {
          code: 'general_error_code',
          error: 'General error occurred',
        },
      },
    };
    expect(getSwapMessage(params)).toBe('General error occurred');
  });

  test('returns empty string when no error and all conditions are satisfied', () => {
    const params = {
      ...baseParams,
      from: { ...baseParams.from, balance: '10', amount: '5', token: ETHToken },
      to: { ...baseParams.to, amount: '5', token: USDCToken },
    };
    expect(getSwapMessage(params)).toBe('');
  });
});
