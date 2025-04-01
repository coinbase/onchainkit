import { RequestContext } from '@/core/network/constants';
import { CDP_GET_PRICE_QUOTE } from '@/core/network/definitions/wallet';
import { sendRequest } from '@/core/network/request';
import { type Mock, describe, expect, it, vi } from 'vitest';
import { getPriceQuote } from './getPriceQuote';
import type {
  GetPriceQuoteParams,
  GetPriceQuoteResponse,
  PriceQuoteToken,
} from './types';

vi.mock('@/core/network/request', () => ({
  sendRequest: vi.fn(),
}));

const mockTokens: PriceQuoteToken[] = [
  'ETH',
  '0x1234567890123456789012345678901234567890',
];

const mockParams: GetPriceQuoteParams = {
  tokens: mockTokens,
};

const mockSuccessResponse: GetPriceQuoteResponse = {
  priceQuotes: [
    {
      name: 'Ethereum',
      symbol: 'ETH',
      contractAddress: '',
      price: '2400',
      timestamp: 1714761600,
    },
    {
      name: 'Test Token',
      symbol: 'TEST',
      contractAddress: '0x1234567890123456789012345678901234567890',
      price: '3.14',
      timestamp: 1714761600,
    },
  ],
};

describe('getPriceQuote', () => {
  const mockSendRequest = sendRequest as Mock;

  it('should return the price quote for a successful request', async () => {
    mockSendRequest.mockResolvedValueOnce({
      result: mockSuccessResponse,
    });

    const result = await getPriceQuote(mockParams);

    expect(result).toEqual(mockSuccessResponse);
    expect(mockSendRequest).toHaveBeenCalledWith(
      CDP_GET_PRICE_QUOTE,
      [mockParams],
      RequestContext.API,
    );
  });

  it('should return an error if no tokens are provided', async () => {
    const result = await getPriceQuote({
      tokens: [],
    });

    expect(result).toEqual({
      code: 'INVALID_INPUT',
      error: 'Invalid input: tokens must be an array of at least one token',
      message: 'Tokens must be an array of at least one token',
    });
  });

  it('should handle API error response', async () => {
    const mockError = {
      code: 500,
      error: 'Internal Server Error',
      message: 'Internal Server Error',
    };

    mockSendRequest.mockResolvedValueOnce({
      error: mockError,
    });

    const result = await getPriceQuote(mockParams);

    expect(result).toEqual({
      code: `${mockError.code}`,
      error: 'Error fetching price quote',
      message: mockError.message,
    });
  });

  it('should handle unexpected errors', async () => {
    const errorMessage = 'Network Error';
    mockSendRequest.mockRejectedValueOnce(new Error(errorMessage));

    const result = await getPriceQuote(mockParams);

    expect(result).toEqual({
      code: 'UNCAUGHT_PRICE_QUOTE_ERROR',
      error: 'Something went wrong',
      message: `Error fetching price quote: Error: ${errorMessage}`,
    });
  });
});
