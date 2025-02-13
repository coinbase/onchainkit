import type { Token } from '@/token';
import { base, baseSepolia } from 'viem/chains';
import { describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import { USDC_BY_CHAIN } from '../constants';
import { defaultPriceFetcher } from './defaultPriceFetcher';
import { getETHPrice } from './getETHPrice';

vi.mock('./getETHPrice', () => ({
  getETHPrice: vi.fn(),
}));

describe('defaultPriceFetcher', () => {
  const mockETHToken: Token = {
    name: 'Ethereum',
    address: '',
    symbol: 'ETH',
    decimals: 18,
    image: 'https://example.com/eth.png',
    chainId: base.id,
  };

  const mockUSDCToken: Token = {
    name: 'USD Coin',
    address: USDC_BY_CHAIN[base.id].address,
    symbol: 'USDC',
    decimals: 6,
    image: 'https://example.com/usdc.png',
    chainId: base.id,
  };

  const mockSepoliaUSDCToken: Token = {
    name: 'USD Coin',
    address: USDC_BY_CHAIN[baseSepolia.id].address,
    symbol: 'USDC',
    decimals: 6,
    image: 'https://example.com/usdc.png',
    chainId: baseSepolia.id,
  };

  const mockOtherToken: Token = {
    name: 'Other Token',
    address: '0x123456789',
    symbol: 'OTHER',
    decimals: 18,
    image: 'https://example.com/other.png',
    chainId: base.id,
  };

  it('should return ETH price * amount for ETH token', async () => {
    const mockETHPrice = '1800.50';
    (getETHPrice as Mock).mockResolvedValue(mockETHPrice);

    const result = await defaultPriceFetcher('2', mockETHToken);

    expect(getETHPrice).toHaveBeenCalled();
    expect(result).toBe('3601.00');
  });

  it('should return same amount for Base USDC token', async () => {
    const result = await defaultPriceFetcher('100', mockUSDCToken);

    expect(result).toBe('100.00');
  });

  it('should return same amount for Sepolia USDC token', async () => {
    const result = await defaultPriceFetcher('100', mockSepoliaUSDCToken);

    expect(result).toBe('100.00');
  });

  it('should return empty string for other tokens', async () => {
    const result = await defaultPriceFetcher('100', mockOtherToken);

    expect(result).toBe('');
  });
});
