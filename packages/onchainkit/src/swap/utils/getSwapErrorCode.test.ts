import { describe, expect, it } from 'vitest';
import {
  GENERAL_SWAP_BALANCE_ERROR_CODE,
  GENERAL_SWAP_ERROR_CODE,
  GENERAL_SWAP_QUOTE_ERROR_CODE,
  LOW_LIQUIDITY_ERROR_CODE,
  TOO_MANY_REQUESTS_ERROR_CODE,
  UNCAUGHT_SWAP_ERROR_CODE,
  UNCAUGHT_SWAP_QUOTE_ERROR_CODE,
} from '../constants';
import { getSwapErrorCode } from './getSwapErrorCode';

describe('getSwapErrorCode', () => {
  it('should return LOW_LIQUIDITY_ERROR_CODE for errorCode -32602', () => {
    const result = getSwapErrorCode('swap', -32602);
    expect(result).toBe(LOW_LIQUIDITY_ERROR_CODE);
  });

  it('should return TOO_MANY_REQUESTS_ERROR_CODE for errorCode -32001', () => {
    const result = getSwapErrorCode('swap', -32001);
    expect(result).toBe(TOO_MANY_REQUESTS_ERROR_CODE);
  });

  it('should return GENERAL_SWAP_QUOTE_ERROR_CODE for context "quote"', () => {
    const result = getSwapErrorCode('quote');
    expect(result).toBe(GENERAL_SWAP_QUOTE_ERROR_CODE);
  });

  it('should return GENERAL_SWAP_BALANCE_ERROR_CODE for context "balance"', () => {
    const result = getSwapErrorCode('balance');
    expect(result).toBe(GENERAL_SWAP_BALANCE_ERROR_CODE);
  });

  it('should return GENERAL_SWAP_ERROR_CODE for context "swap" with no errorCode', () => {
    const result = getSwapErrorCode('swap');
    expect(result).toBe(GENERAL_SWAP_ERROR_CODE);
  });

  it('should return UNCAUGHT_SWAP_QUOTE_ERROR_CODE for context "uncaught-quote"', () => {
    const result = getSwapErrorCode('uncaught-quote');
    expect(result).toBe(UNCAUGHT_SWAP_QUOTE_ERROR_CODE);
  });

  it('should return UNCAUGHT_SWAP_ERROR_CODE for context "uncaught-swap" with no errorCode', () => {
    const result = getSwapErrorCode('uncaught-swap');
    expect(result).toBe(UNCAUGHT_SWAP_ERROR_CODE);
  });

  it('should return GENERAL_SWAP_ERROR_CODE for context "swap" with an unknown errorCode', () => {
    const result = getSwapErrorCode('swap', 12345);
    expect(result).toBe(GENERAL_SWAP_ERROR_CODE);
  });

  it('should return GENERAL_SWAP_QUOTE_ERROR_CODE for context "quote" with an unknown errorCode', () => {
    const result = getSwapErrorCode('quote', 12345);
    expect(result).toBe(GENERAL_SWAP_QUOTE_ERROR_CODE);
  });

  it('should return GENERAL_SWAP_BALANCE_ERROR_CODE for context "balance" with an unknown errorCode', () => {
    const result = getSwapErrorCode('balance', 12345);
    expect(result).toBe(GENERAL_SWAP_BALANCE_ERROR_CODE);
  });
});
