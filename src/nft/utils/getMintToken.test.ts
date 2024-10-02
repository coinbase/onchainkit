import { getMintToken } from './getMintToken';
import { MINT_TOKEN_URI } from '../constants';
import type { GetMintTokenResponse } from '../types';
import { type Mock, vi, describe, beforeEach, it, expect } from 'vitest';

global.fetch = vi.fn();

describe('getMintToken', () => {
  const mockResponse: GetMintTokenResponse = {
    callData: {
      to: '0x123',
      from: '0x456',
      data: '0x789',
      value: '1',
    },
  };

  beforeEach(() => {
    (fetch as Mock).mockClear();
  });

  it('should return null if required parameters are missing', async () => {
    const result = await getMintToken({
      mintAddress: '',
      takerAddress: '',
      network: '',
      quantity: '1',
      tokenId: undefined,
    });
    expect(result).toBeNull();
  });

  it('should call fetch with correct parameters and return data', async () => {
    (fetch as Mock).mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await getMintToken({
      mintAddress: '0x123',
      takerAddress: '0x456',
      network: 'mainnet',
      quantity: '1',
      tokenId: '1',
    });

    expect(fetch).toHaveBeenCalledWith(MINT_TOKEN_URI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bypassSimulation: true,
        loadTest: false,
        mintAddress: '0x123',
        network: 'mainnet',
        quantity: '1',
        takerAddress: '0x456',
        tokenId: '1',
      }),
    });
    expect(result).toEqual(mockResponse);
  });

  it('should omit tokenId if it is undefined', async () => {
    (fetch as Mock).mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await getMintToken({
      mintAddress: '0x123',
      takerAddress: '0x456',
      network: 'mainnet',
      quantity: '1',
      tokenId: undefined,
    });

    expect(fetch).toHaveBeenCalledWith(MINT_TOKEN_URI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bypassSimulation: true,
        loadTest: false,
        mintAddress: '0x123',
        network: 'mainnet',
        quantity: '1',
        takerAddress: '0x456',
      }),
    });
    expect(result).toEqual(mockResponse);
  });
});
