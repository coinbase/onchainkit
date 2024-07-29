import { describe, expect, it } from 'vitest';
import type { Token } from '../../token';
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
const mockEthToken: Token = {
  name: 'ETH',
  address: '0x123456789',
  symbol: 'ETH',
  decimals: 18,
  image:
    'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
  chainId: 8453,
};

const mockToken: Token = {
  name: 'USDC',
  address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  symbol: 'USDC',
  decimals: 6,
  image:
    'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
  chainId: 8453,
};

describe('getTokenBalances', () => {
  it('returns balances for ETH token', () => {
    const result = getTokenBalances({
      token: mockEthToken,
      ethBalance: mockEthBalanceResponse?.data?.value,
      tokenBalance: mockTokenBalanceResponse?.data,
    });

    expect(result?.convertedBalance).toBe('0.0002851826238227');
    expect(result.roundedBalance).toBe('0.00028518');
  });

  it('returns balances for ETH token with 0 balance', () => {
    const result = getTokenBalances({
      token: mockEthToken,
      ethBalance: mockZeroEthBalanceResponse?.data?.value,
      tokenBalance: mockZeroTokenBalanceResponse?.data,
    });

    expect(result?.convertedBalance).toBe('0');
    expect(result.roundedBalance).toBe('0');
  });

  it('returns balances for erc20 token', () => {
    const result = getTokenBalances({
      token: mockToken,
      ethBalance: mockEthBalanceResponse?.data?.value,
      tokenBalance: mockTokenBalanceResponse?.data,
    });

    expect(result?.convertedBalance).toBe('3304007.277394');
    expect(result.roundedBalance).toBe('3304007.277394');
  });

  it('returns balances for erc20 token with 0 balance', () => {
    const result = getTokenBalances({
      token: mockToken,
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
