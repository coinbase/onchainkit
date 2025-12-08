import { describe, expect, it } from 'vitest';
import {
  LOW_LIQUIDITY_ERROR_CODE,
  SwapMessage,
  TOO_MANY_REQUESTS_ERROR_CODE,
  USER_REJECTED_ERROR_CODE,
} from '../constants';
import type { SwapError } from '../types';
import { getErrorMessage } from './getErrorMessage';

describe('getSwapError', () => {
  it('should return TOO_MANY_REQUESTS when error code is TOO_MANY_REQUESTS_ERROR_CODE', () => {
    const error: SwapError = {
      code: TOO_MANY_REQUESTS_ERROR_CODE,
      error: 'Too many requests error',
      message: '',
    };
    expect(getErrorMessage(error)).toBe(SwapMessage.TOO_MANY_REQUESTS);
  });

  it('should return LOW_LIQUIDITY when error code is LOW_LIQUIDITY_ERROR_CODE', () => {
    const error: SwapError = {
      code: LOW_LIQUIDITY_ERROR_CODE,
      error: 'Low liquidity error',
      message: '',
    };
    expect(getErrorMessage(error)).toBe(SwapMessage.LOW_LIQUIDITY);
  });

  it('should return USER_REJECTED when error code is USER_REJECTED_ERROR_CODE', () => {
    const error: SwapError = {
      code: USER_REJECTED_ERROR_CODE,
      error: 'User rejected error',
      message: '',
    };
    expect(getErrorMessage(error)).toBe(SwapMessage.USER_REJECTED);
  });

  it('should return the first error message when general error is present', () => {
    const error: SwapError = {
      code: 'general_error_code',
      error: 'General error occurred',
      message: '',
    };
    expect(getErrorMessage(error)).toBe('');
  });
});
