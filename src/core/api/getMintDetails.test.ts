import { type Mock, describe, expect, it, vi } from 'vitest';
import { CDP_GET_MINT_DETAILS } from '../network/definitions/nft';
import { sendRequest } from '../network/request';
import { getMintDetails } from './getMintDetails';
import type { GetMintDetailsParams } from './types';

vi.mock('../network/request', () => ({
  sendRequest: vi.fn(),
}));

describe('getMintDetails', () => {
  const mockSendRequest = sendRequest as Mock;

  const params: GetMintDetailsParams = {
    contractAddress: '0x123',
    takerAddress: '0x456',
  };

  it('should return mint details when request is successful', async () => {
    const mockResponse = {
      result: {
        price: {
          amount: '1',
          currency: 'ETH',
          amountUsd: '2000',
        },
        fee: {
          amount: '0.1',
          currency: 'ETH',
          amountUsd: '200',
        },
        maxMintsPerWallet: 3,
        isEligibleToMint: true,
        creatorAddress: '0x123',
        totalTokens: '10',
        totalOwners: '5',
        network: 'networks/base-mainnet',
      },
    };

    mockSendRequest.mockResolvedValueOnce(mockResponse);

    const result = await getMintDetails(params);

    expect(result).toEqual(mockResponse.result);
    expect(mockSendRequest).toHaveBeenCalledWith(CDP_GET_MINT_DETAILS, [
      params,
    ]);
  });

  it('should return error details when request fails with an error', async () => {
    const mockErrorResponse = {
      error: {
        code: '404',
        message: 'Not Found',
      },
    };

    mockSendRequest.mockResolvedValueOnce(mockErrorResponse);

    const result = await getMintDetails(params);

    expect(result).toEqual({
      code: '404',
      error: 'Error fetching mint details',
      message: 'Not Found',
    });
    expect(mockSendRequest).toHaveBeenCalledWith(CDP_GET_MINT_DETAILS, [
      params,
    ]);
  });

  it('should return uncaught error details when an exception is thrown', async () => {
    mockSendRequest.mockRejectedValue(new Error('Network Error'));

    const result = await getMintDetails(params);

    expect(result).toEqual({
      code: 'uncaught-nft',
      error: 'Something went wrong',
      message: 'Error fetching mint details',
    });
    expect(mockSendRequest).toHaveBeenCalledWith(CDP_GET_MINT_DETAILS, [
      params,
    ]);
  });
});
