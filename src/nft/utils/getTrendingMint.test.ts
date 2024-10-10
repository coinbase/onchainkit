import { getTrendingMint } from './getTrendingMint';
import { TRENDING_MINT_URI } from '../constants';
import type { MintCollection } from '../types';
import { type Mock, vi, describe, beforeEach, it, expect } from 'vitest';

global.fetch = vi.fn();

describe('getTrendingMint', () => {
  const mockAddress = '0x123';
  const mockTakerAddress = '0x456';
  const mockNetwork = 'mainnet';
  const mockResponse: MintCollection = {
    address: '0x123',
    animationUrl: 'https://example.com/animation',
  };

  beforeEach(() => {
    (fetch as Mock).mockClear();
  });

  it('should return null if address is not provided', async () => {
    const result = await getTrendingMint('', mockTakerAddress, mockNetwork);
    expect(result).toBeNull();
  });

  it('should call fetch with the correct URL and parameters', async () => {
    (fetch as Mock).mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await getTrendingMint(
      mockAddress,
      mockTakerAddress,
      mockNetwork,
    );

    const url = new URL(TRENDING_MINT_URI);
    url.search = new URLSearchParams({
      address: mockAddress,
      takerAddress: mockTakerAddress,
      network: mockNetwork,
    }).toString();

    expect(fetch).toHaveBeenCalledWith(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    expect(result).toEqual(mockResponse);
  });
});
