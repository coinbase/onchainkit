import type { ReadContractErrorType } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { UseBalanceReturnType, UseReadContractReturnType } from 'wagmi';
import { DEGEN_TOKEN, ETH_TOKEN } from '../mocks';
/**
 * @vitest-environment node
 */
import { getTokenBalanceErrorState } from './getTokenBalanceErrorState';

describe('getTokenBalanceErrorState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return error and code for ETH balance error', () => {
    const ethBalance = {
      error: { message: 'ETH balance error' },
    } as UseBalanceReturnType;
    const tokenBalance = undefined;
    const result = getTokenBalanceErrorState({
      ethBalance,
      token: ETH_TOKEN,
      tokenBalance,
    });
    expect(result).toEqual({
      error: 'ETH balance error',
      code: 'SWAP_BALANCE_ERROR',
    });
  });

  it('should return error and code for token balance error', () => {
    const ethBalance = undefined;
    const tokenBalance = {
      isError: true,
      error: { shortMessage: 'Token balance error' } as ReadContractErrorType,
    } as UseReadContractReturnType;
    const result = getTokenBalanceErrorState({
      ethBalance,
      token: DEGEN_TOKEN,
      tokenBalance,
    });
    expect(result).toEqual({
      error: 'Token balance error',
      code: 'SWAP_BALANCE_ERROR',
    });
  });

  it('should return undefined if no errors are present', () => {
    const ethBalance = undefined;
    const token = undefined;
    const tokenBalance = undefined;
    const result = getTokenBalanceErrorState({
      ethBalance,
      token,
      tokenBalance,
    });
    expect(result).toBeUndefined();
  });

  it('should return undefined if token is ETH and there is no ethBalance error', () => {
    const ethBalance = {} as UseBalanceReturnType;
    const tokenBalance = undefined;
    const result = getTokenBalanceErrorState({
      ethBalance,
      token: ETH_TOKEN,
      tokenBalance,
    });
    expect(result).toBeUndefined();
  });

  it('should return undefined if token is not ETH and there is no tokenBalance error', () => {
    const ethBalance = undefined;
    const tokenBalance = { isError: false } as UseReadContractReturnType;
    const result = getTokenBalanceErrorState({
      ethBalance,
      token: DEGEN_TOKEN,
      tokenBalance,
    });
    expect(result).toBeUndefined();
  });
});
