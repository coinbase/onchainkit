/**
 * @jest-environment jsdom
 */
import { getTokenBalanceErrorState } from './getTokenBalanceErrorState';
import type { Token } from '../../token';
import type { UseBalanceReturnType, UseReadContractReturnType } from 'wagmi';
import type { ReadContractErrorType } from 'viem';

const ETH: Token = {
  name: 'ETH',
  address: '',
  symbol: 'ETH',
  decimals: 18,
  image:
    'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
  chainId: 8453,
};
const DEGEN: Token = {
  name: 'DEGEN',
  address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
  symbol: 'DEGEN',
  decimals: 18,
  image:
    'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/3b/bf/3bbf118b5e6dc2f9e7fc607a6e7526647b4ba8f0bea87125f971446d57b296d2-MDNmNjY0MmEtNGFiZi00N2I0LWIwMTItMDUyMzg2ZDZhMWNm',
  chainId: 8453,
};

describe('getTokenBalanceErrorState', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return error and code for ETH balance error', () => {
    const ethBalance = {
      error: { message: 'ETH balance error' },
    } as UseBalanceReturnType;
    const tokenBalance = undefined;

    const result = getTokenBalanceErrorState({
      ethBalance,
      token: ETH,
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
      token: DEGEN,
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
      token: ETH,
      tokenBalance,
    });

    expect(result).toBeUndefined();
  });

  it('should return undefined if token is not ETH and there is no tokenBalance error', () => {
    const ethBalance = undefined;
    const tokenBalance = { isError: false } as UseReadContractReturnType;

    const result = getTokenBalanceErrorState({
      ethBalance,
      token: DEGEN,
      tokenBalance,
    });

    expect(result).toBeUndefined();
  });
});
