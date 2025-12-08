import { describe, expect, it } from 'vitest';
import { ETH_TOKEN, USDC_TOKEN } from '../mocks';
/**
 * @vitest-environment node
 */
import { getTokenBalances } from './getTokenBalances';

const mockTokenBalanceResponse = { data: 3304007277394n };
const mockZeroTokenBalanceResponse = { data: 0n };
const mockEthBalanceResponse = {
  data: {
    decimals: 18,
    formatted: '0.0002851826238227',
    symbol: 'ETH',
    value: 285182623822700n,
  },
};
const mockZeroEthBalanceResponse = {
  data: {
    decimals: 18,
    formatted: '0',
    symbol: 'ETH',
    value: 0n,
  },
};

describe('getTokenBalances', () => {
  it('returns balances for ETH token', () => {
    const result = getTokenBalances({
      token: ETH_TOKEN,
      ethBalance: mockEthBalanceResponse?.data?.value,
      tokenBalance: mockTokenBalanceResponse?.data,
    });
    expect(result?.convertedBalance).toBe('0.0002851826238227');
    expect(result.roundedBalance).toBe('0.00028518');
  });

  it('returns balances for ETH token with 0 balance', () => {
    const result = getTokenBalances({
      token: ETH_TOKEN,
      ethBalance: mockZeroEthBalanceResponse?.data?.value,
      tokenBalance: mockZeroTokenBalanceResponse?.data,
    });
    expect(result?.convertedBalance).toBe('0');
    expect(result.roundedBalance).toBe('0');
  });

  it('returns balances for erc20 token', () => {
    const result = getTokenBalances({
      token: USDC_TOKEN,
      ethBalance: mockEthBalanceResponse?.data?.value,
      tokenBalance: mockTokenBalanceResponse?.data,
    });
    expect(result?.convertedBalance).toBe('3304007.277394');
    expect(result.roundedBalance).toBe('3304007.277394');
  });

  it('returns balances for erc20 token with 0 balance', () => {
    const result = getTokenBalances({
      token: USDC_TOKEN,
      ethBalance: mockZeroEthBalanceResponse?.data?.value,
      tokenBalance: mockZeroTokenBalanceResponse?.data,
    });
    expect(result?.convertedBalance).toBe('0');
    expect(result.roundedBalance).toBe('0');
  });

  it('returns handles missing data correctly', () => {
    const result = getTokenBalances({
      ethBalance: mockEthBalanceResponse?.data?.value,
      tokenBalance: mockTokenBalanceResponse?.data,
    });
    expect(result?.convertedBalance).toBe('');
    expect(result.roundedBalance).toBe('');
  });
});
