import { RequestContext } from '@/core/network/constants';
import { CDP_GET_TOKEN_DETAILS } from '@/core/network/definitions/nft';
import { sendRequest } from '@/core/network/request';
import { type Mock, describe, expect, it, vi } from 'vitest';
import { getTokenDetails } from './getTokenDetails';
import type { GetTokenDetailsParams } from './types';

vi.mock('@/core/network/request', () => ({
  sendRequest: vi.fn(),
}));

describe('getTokenDetails', () => {
  const mockSendRequest = sendRequest as Mock;

  const params: GetTokenDetailsParams = {
    contractAddress: '0x123',
    tokenId: '1',
  };

  it('should return token details when request is successful', async () => {
    const mockResponse = {
      result: {
        name: 'NFT Name',
        description: 'NFT Description',
        imageUrl: 'https://nft-image-url.com',
        animationUrl: 'https://nft-animation-url.com',
        mimeType: 'image/png',
        ownerAddress: '0x123',
        lastSoldPrice: {
          amount: '1',
          currency: 'ETH',
          amountUSD: '2000',
        },
        contractType: 'ERC721',
      },
    };

    mockSendRequest.mockResolvedValueOnce(mockResponse);

    const result = await getTokenDetails(params);

    expect(result).toEqual(mockResponse.result);
    expect(mockSendRequest).toHaveBeenCalledWith(
      CDP_GET_TOKEN_DETAILS,
      [params],
      RequestContext.API,
    );
  });

  it('should return error details when request fails with an error', async () => {
    const mockErrorResponse = {
      error: {
        code: '404',
        message: 'Not Found',
      },
    };

    mockSendRequest.mockResolvedValueOnce(mockErrorResponse);

    const result = await getTokenDetails(params);

    expect(result).toEqual({
      code: '404',
      error: 'Error fetching token details',
      message: 'Not Found',
    });
    expect(mockSendRequest).toHaveBeenCalledWith(
      CDP_GET_TOKEN_DETAILS,
      [params],
      RequestContext.API,
    );
  });

  it('should return uncaught error details when an exception is thrown', async () => {
    mockSendRequest.mockRejectedValue(new Error('Network Error'));

    const result = await getTokenDetails(params);

    expect(result).toEqual({
      code: 'uncaught-nft',
      error: 'Something went wrong',
      message: 'Error fetching token details',
    });
    expect(mockSendRequest).toHaveBeenCalledWith(
      CDP_GET_TOKEN_DETAILS,
      [params],
      RequestContext.API,
    );
  });
});
