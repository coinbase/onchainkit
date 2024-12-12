import { describe, expect, it, vi } from 'vitest';
import {
  LOW_LIQUIDITY_ERROR_CODE,
  SwapMessage,
  TOO_MANY_REQUESTS_ERROR_CODE,
  USER_REJECTED_ERROR_CODE,
} from '../constants';
import { ETH_TOKEN, USDC_TOKEN } from '../mocks';
import type { GetSwapMessageParams } from '../types';
/**
 * @vitest-environment node
 */
import { getSwapMessage } from './getSwapMessage';

describe('getSwapMessage', () => {
  const baseParams = {
    address: '0x123' as `0x${string}`,
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
    lifecycleStatus: {
      statusName: 'init',
      statusData: { isMissingRequiredField: false, maxSlippage: 3 },
    },
  };

  it('should return BALANCE_ERROR when from or to has an error', () => {
    const params = {
      ...baseParams,
      from: {
        ...baseParams.from,
        error: { code: 'some_code', error: 'some error' },
      },
    } as unknown as GetSwapMessageParams;
    expect(getSwapMessage(params)).toBe(SwapMessage.BALANCE_ERROR);

    const params2 = {
      ...baseParams,
      to: {
        ...baseParams.to,
        error: { code: 'some_code', error: 'some error' },
      },
    } as unknown as GetSwapMessageParams;
    expect(getSwapMessage(params2)).toBe(SwapMessage.BALANCE_ERROR);
  });

  it('should return INSUFFICIENT_BALANCE when amount exceeds balance', () => {
    const params = {
      ...baseParams,
      from: { ...baseParams.from, balance: '10', amount: '20' },
    } as unknown as GetSwapMessageParams;
    expect(getSwapMessage(params)).toBe(SwapMessage.INSUFFICIENT_BALANCE);
  });

  it('should return CONFIRM IN WALLET when pending transaction', () => {
    const params = {
      ...baseParams,
      lifecycleStatus: { statusName: 'transactionPending', statusData: null },
    } as unknown as GetSwapMessageParams;
    expect(getSwapMessage(params)).toBe(SwapMessage.CONFIRM_IN_WALLET);
  });

  it('should return SWAP_IN_PROGRESS when loading is true', () => {
    const params = {
      ...baseParams,
      lifecycleStatus: { statusName: 'transactionApproved', statusData: null },
    } as unknown as GetSwapMessageParams;
    expect(getSwapMessage(params)).toBe(SwapMessage.SWAP_IN_PROGRESS);
  });

  it('should return FETCHING_QUOTE when to or from loading is true', () => {
    const params = {
      ...baseParams,
      from: { ...baseParams.from, loading: true },
    } as unknown as GetSwapMessageParams;
    expect(getSwapMessage(params)).toBe(SwapMessage.FETCHING_QUOTE);

    const params2 = {
      ...baseParams,
      to: { ...baseParams.to, loading: true },
    } as unknown as GetSwapMessageParams;
    expect(getSwapMessage(params2)).toBe(SwapMessage.FETCHING_QUOTE);
  });

  it('should return INCOMPLETE_FIELD when required fields are missing', () => {
    const params = {
      ...baseParams,
      lifecycleStatus: {
        statusName: 'init',
        statusData: { isMissingRequiredField: true },
      },
    } as unknown as GetSwapMessageParams;
    expect(getSwapMessage(params)).toBe(SwapMessage.INCOMPLETE_FIELD);
  });

  it('should return TOO_MANY_REQUESTS when error code is TOO_MANY_REQUESTS_ERROR_CODE', () => {
    const params = {
      ...baseParams,
      from: {
        ...baseParams.from,
        balance: '10',
        amount: '5',
        token: ETH_TOKEN,
      },
      to: { ...baseParams.to, amount: '5', token: USDC_TOKEN },
      lifecycleStatus: {
        statusName: 'error',
        statusData: {
          code: TOO_MANY_REQUESTS_ERROR_CODE,
          error: 'Too many requests error',
          message: '',
        },
      },
    } as unknown as GetSwapMessageParams;
    expect(getSwapMessage(params)).toBe(SwapMessage.TOO_MANY_REQUESTS);
  });

  it('should return LOW_LIQUIDITY when error code is LOW_LIQUIDITY_ERROR_CODE', () => {
    const params = {
      ...baseParams,
      from: {
        ...baseParams.from,
        balance: '10',
        amount: '5',
        token: ETH_TOKEN,
      },
      to: { ...baseParams.to, amount: '5', token: USDC_TOKEN },
      lifecycleStatus: {
        statusName: 'error',
        statusData: {
          code: LOW_LIQUIDITY_ERROR_CODE,
          error: 'Low liquidity error',
          message: '',
        },
      },
    } as unknown as GetSwapMessageParams;
    expect(getSwapMessage(params)).toBe(SwapMessage.LOW_LIQUIDITY);
  });

  it('should return USER_REJECTED when error code is USER_REJECTED_ERROR_CODE', () => {
    const params = {
      ...baseParams,
      from: {
        ...baseParams.from,
        balance: '10',
        amount: '5',
        token: ETH_TOKEN,
      },
      to: { ...baseParams.to, amount: '5', token: USDC_TOKEN },
      lifecycleStatus: {
        statusName: 'error',
        statusData: {
          code: USER_REJECTED_ERROR_CODE,
          error: 'User rejected error',
          message: '',
        },
      },
    } as unknown as GetSwapMessageParams;
    expect(getSwapMessage(params)).toBe(SwapMessage.USER_REJECTED);
  });

  it('should return the first error message when general error is present', () => {
    const params = {
      ...baseParams,
      from: {
        ...baseParams.from,
        balance: '10',
        amount: '5',
        token: ETH_TOKEN,
      },
      to: { ...baseParams.to, amount: '5', token: USDC_TOKEN },
      lifecycleStatus: {
        statusName: 'error',
        statusData: {
          code: 'general_error_code',
          error: 'General error occurred',
          message: '',
        },
      },
    } as unknown as GetSwapMessageParams;
    expect(getSwapMessage(params)).toBe('');
  });

  it('should return empty string when no error and all conditions are satisfied', () => {
    const params = {
      ...baseParams,
      from: {
        ...baseParams.from,
        balance: '10',
        amount: '5',
        token: ETH_TOKEN,
      },
      to: { ...baseParams.to, amount: '5', token: USDC_TOKEN },
    } as unknown as GetSwapMessageParams;
    expect(getSwapMessage(params)).toBe('');
  });
});
