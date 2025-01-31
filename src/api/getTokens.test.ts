import { RequestContext } from '@/core/network/constants';
import { CDP_LIST_SWAP_ASSETS } from '@/core/network/definitions/swap';
import { sendRequest } from '@/core/network/request';
import { type Mock, afterEach, describe, expect, it, vi } from 'vitest';
/**
 * @vitest-environment node
 */
import { getTokens } from './getTokens';

vi.mock('@/core/network/request');

describe('getTokens', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return an array of tokens', async () => {
    const mockResponse = {
      result: [
        {
          address: '0x123',
          chainId: 1,
          decimals: 18,
          image: 'https://example.com/token.png',
          name: 'Token 1',
          symbol: 'TKN1',
        },
        {
          address: '0x456',
          chainId: 1,
          decimals: 18,
          image: 'https://example.com/token.png',
          name: 'Token 2',
          symbol: 'TKN2',
        },
      ],
      error: null,
    };
    (sendRequest as Mock).mockResolvedValue(mockResponse);
    const tokens = await getTokens();
    expect(tokens).toEqual([
      {
        address: '0x123',
        chainId: 1,
        decimals: 18,
        image: 'https://example.com/token.png',
        name: 'Token 1',
        symbol: 'TKN1',
      },
      {
        address: '0x456',
        chainId: 1,
        decimals: 18,
        image: 'https://example.com/token.png',
        name: 'Token 2',
        symbol: 'TKN2',
      },
    ]);
    expect(sendRequest).toHaveBeenCalledTimes(1);
    expect(sendRequest).toHaveBeenCalledWith(
      CDP_LIST_SWAP_ASSETS,
      [{ limit: '50', page: '1' }],
      RequestContext.API,
    );
  });

  it('should accept options parameters', async () => {
    const mockResponse = {
      result: [
        {
          address: '0x123',
          chainId: 1,
          decimals: 18,
          image: 'https://example.com/token.png',
          name: 'Token 1',
          symbol: 'TKN1',
        },
      ],
      error: null,
    };
    (sendRequest as Mock).mockResolvedValue(mockResponse);
    const tokens = await getTokens({ limit: '1', page: '1' });
    expect(tokens).toEqual([
      {
        address: '0x123',
        chainId: 1,
        decimals: 18,
        image: 'https://example.com/token.png',
        name: 'Token 1',
        symbol: 'TKN1',
      },
    ]);
    expect(sendRequest).toHaveBeenCalledTimes(1);
    expect(sendRequest).toHaveBeenCalledWith(
      CDP_LIST_SWAP_ASSETS,
      [{ limit: '1', page: '1' }],
      RequestContext.API,
    );
  });

  it('should return an error object if sendRequest returns an error', async () => {
    (sendRequest as Mock).mockResolvedValue({
      result: null,
      error: {
        code: -1,
        message: 'Request failed',
        data: null,
      },
    });
    const error = await getTokens();
    expect(error).toEqual({
      code: 'AmGTa01',
      error: '-1',
      message: 'Request failed',
    });
    expect(sendRequest).toHaveBeenCalledTimes(1);
    expect(sendRequest).toHaveBeenCalledWith(
      CDP_LIST_SWAP_ASSETS,
      [{ limit: '50', page: '1' }],
      RequestContext.API,
    );
  });

  it('should rethrow the error if an error occurs during token retrieval', async () => {
    const mockError = new Error(
      'getTokens: error retrieving tokens: Token retrieval failed',
    );
    (sendRequest as Mock).mockRejectedValue(mockError);
    const error = await getTokens();
    expect(error).toEqual({
      code: 'AmGTa02',
      error: JSON.stringify(mockError),
      message: 'Request failed',
    });
    expect(sendRequest).toHaveBeenCalledTimes(1);
    expect(sendRequest).toHaveBeenCalledWith(
      CDP_LIST_SWAP_ASSETS,
      [{ limit: '50', page: '1' }],
      RequestContext.API,
    );
  });
});
