import type {
  PortfolioTokenBalances,
  PortfolioTokenWithFiatValue,
} from '@/core/api/types';
import { type Mock, describe, expect, it, vi } from 'vitest';
import { getPortfolioTokenBalances } from './getPortfolioTokenBalances';
import { sendRequest } from '../network/request';
import { CDP_GET_PORTFOLIO_TOKEN_BALANCES } from '../network/definitions/wallet';

vi.mock('../network/request', () => ({
  sendRequest: vi.fn(),
}));

const mockAddresses: `0x${string}`[] = ['0x123'];
const mockTokens: PortfolioTokenWithFiatValue[] = [
  {
    address: '0x123',
    chainId: 8453,
    decimals: 6,
    image: '',
    name: 'Token',
    symbol: 'TOKEN',
    crypto_balance: 100,
    fiat_balance: 100,
  },
];
const mockPortfolioTokenBalances: PortfolioTokenBalances[] = [
  {
    address: mockAddresses[0],
    token_balances: mockTokens,
    portfolio_balance_usd: 100,
  },
];

describe('getPortfolioTokenBalances', () => {
  const mockSendRequest = sendRequest as Mock;

  const mockSuccessResponse = {
    tokens: mockPortfolioTokenBalances,
  };

  it('should return token balances on successful request', async () => {
    mockSendRequest.mockResolvedValueOnce({
      result: mockSuccessResponse,
    });

    const result = await getPortfolioTokenBalances({
      addresses: mockAddresses as `0x${string}`[],
    });

    expect(result).toEqual(mockSuccessResponse);
    expect(mockSendRequest).toHaveBeenCalledWith(CDP_GET_PORTFOLIO_TOKEN_BALANCES, [
      { addresses: mockAddresses },
    ]);
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

    const result = await getPortfolioTokenBalances({
      addresses: mockAddresses,
    });

    expect(result).toEqual({
      code: '500',
      error: 'Error fetching portfolio token balances',
      message: 'Internal Server Error',
    });
  });

  it('should handle unexpected errors', async () => {
    const errorMessage = 'Network Error';
    mockSendRequest.mockRejectedValueOnce(new Error(errorMessage));

    const result = await getPortfolioTokenBalances({
      addresses: mockAddresses,
    });

    expect(result).toEqual({
      code: 'uncaught-portfolio',
      error: 'Something went wrong',
      message: `Error fetching portfolio token balances: Error: ${errorMessage}`,
    });
  });
});
