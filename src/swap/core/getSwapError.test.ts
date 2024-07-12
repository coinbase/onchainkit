import { getSwapError } from './getSwapError';
import {
  LOW_LIQUIDITY_ERROR_CODE,
  TOO_MANY_REQUESTS_ERROR_CODE,
  USER_REJECTED_ERROR_CODE,
} from '../constants';
import { SwapMessage } from './getSwapMessage';
import type { SwapErrorState } from '../types';
import { describe, expect, test, vi } from 'vitest';

describe('getSwapError', () => {
  test('returns TOO_MANY_REQUESTS when error code is TOO_MANY_REQUESTS_ERROR_CODE', () => {
    const error: SwapErrorState = {
      quoteError: {
        code: TOO_MANY_REQUESTS_ERROR_CODE,
        error: 'Too many requests error',
      },
    };
    expect(getSwapError(error)).toBe(SwapMessage.TOO_MANY_REQUESTS);
  });

  test('returns LOW_LIQUIDITY when error code is LOW_LIQUIDITY_ERROR_CODE', () => {
    const error: SwapErrorState = {
      quoteError: {
        code: LOW_LIQUIDITY_ERROR_CODE,
        error: 'Low liquidity error',
      },
    };
    expect(getSwapError(error)).toBe(SwapMessage.LOW_LIQUIDITY);
  });

  test('returns USER_REJECTED when error code is USER_REJECTED_ERROR_CODE', () => {
    const error: SwapErrorState = {
      quoteError: {
        code: USER_REJECTED_ERROR_CODE,
        error: 'User rejected error',
      },
    };
    expect(getSwapError(error)).toBe(SwapMessage.USER_REJECTED);
  });

  test('returns the first error message when general error is present', () => {
    const error: SwapErrorState = {
      quoteError: {
        code: 'general_error_code',
        error: 'General error occurred',
      },
    };
    expect(getSwapError(error)).toBe('General error occurred');
  });

  test('returns undefined when no error', () => {
    const error: SwapErrorState = {};
    expect(getSwapError(error)).toBeUndefined();
  });
});
