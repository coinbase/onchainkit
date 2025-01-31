import { getSwapQuote } from '@/api/getSwapQuote';
import { RequestContext } from '@/core/network/constants';
import { formatTokenAmount } from '@/internal/utils/formatTokenAmount';
import { isSwapError } from '@/swap/utils/isSwapError';
import type { Token } from '@/token/types';
import { base } from 'viem/chains';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { getBuyQuote } from './getBuyQuote';

vi.mock('@/api/getSwapQuote');
vi.mock('@/internal/utils/formatTokenAmount');
vi.mock('@/swap/utils/isSwapError');

const toToken: Token = {
  name: 'DEGEN',
  address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
  symbol: 'DEGEN',
  decimals: 18,
  image:
    'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/3b/bf/3bbf118b5e6dc2f9e7fc607a6e7526647b4ba8f0bea87125f971446d57b296d2-MDNmNjY0MmEtNGFiZi00N2I0LWIwMTItMDUyMzg2ZDZhMWNm',
  chainId: base.id,
};

const fromToken: Token = {
  name: 'ETH',
  address: '',
  symbol: 'ETH',
  decimals: 18,
  image:
    'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
  chainId: base.id,
};

const mockResponse = {
  from: fromToken,
  to: toToken,
  fromAmount: '16732157880511600003860',
  toAmount: '100000000000000000',
  amountReference: 'from',
  priceImpact: '0.07',
  chainId: 8453,
  hasHighPriceImpact: false,
  slippage: '3',
  toAmountUSD: '100',
};

const mockEmptyResponse = {
  from: fromToken,
  to: toToken,
  toAmount: '',
  fromAmount: '16732157880511600003860',
  priceImpact: '0.07',
  chainId: 8453,
  hasHighPriceImpact: false,
  slippage: '3',
  toAmountUSD: '',
};

const mockFromSwapUnit = {
  setAmountUSD: vi.fn(),
  setAmount: vi.fn(),
  amount: '1',
  amountUSD: '1',
  loading: false,
  setLoading: vi.fn(),
  token: fromToken,
};

describe('getBuyQuote', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return default values if `from` token is not provided', async () => {
    const result = await getBuyQuote({
      amount: '1',
      maxSlippage: '0.5',
      to: toToken,
      useAggregator: true,
      fromSwapUnit: mockFromSwapUnit,
    });

    expect(result).toEqual({
      response: undefined,
      formattedFromAmount: '',
      error: undefined,
    });
  });

  it('should call `getSwapQuote` if `from` and `to` tokens are different', async () => {
    (getSwapQuote as Mock).mockResolvedValue(mockResponse);
    (isSwapError as unknown as Mock).mockReturnValue(false);
    (formatTokenAmount as Mock).mockReturnValue('1.0');

    const result = await getBuyQuote({
      amount: '1',
      from: fromToken,
      maxSlippage: '0.5',
      to: toToken,
      useAggregator: true,
      fromSwapUnit: mockFromSwapUnit,
    });

    expect(getSwapQuote).toHaveBeenCalledWith(
      {
        amount: '1',
        amountReference: 'from',
        from: toToken,
        maxSlippage: '0.5',
        to: fromToken,
        useAggregator: true,
      },
      RequestContext.Buy,
    );

    expect(formatTokenAmount).toHaveBeenCalledWith('100000000000000000', 18);
    expect(mockFromSwapUnit.setAmountUSD).toHaveBeenCalledWith('100');
    expect(mockFromSwapUnit.setAmount).toHaveBeenCalledWith('1.0');

    expect(result).toEqual({
      response: mockResponse,
      formattedFromAmount: '1.0',
      error: undefined,
    });
  });

  it('should handle case where amount values are undefined', async () => {
    (getSwapQuote as Mock).mockResolvedValue(mockEmptyResponse);
    (isSwapError as unknown as Mock).mockReturnValue(false);
    (formatTokenAmount as Mock).mockReturnValue('1.0');

    const result = await getBuyQuote({
      amount: '1',
      from: fromToken,
      maxSlippage: '0.5',
      to: toToken,
      useAggregator: true,
      fromSwapUnit: mockFromSwapUnit,
    });

    expect(getSwapQuote).toHaveBeenCalledWith(
      {
        amount: '1',
        amountReference: 'from',
        from: toToken,
        maxSlippage: '0.5',
        to: fromToken,
        useAggregator: true,
      },
      RequestContext.Buy,
    );

    expect(formatTokenAmount).not.toHaveBeenCalled();
    expect(mockFromSwapUnit.setAmountUSD).toHaveBeenCalledWith('');
    expect(mockFromSwapUnit.setAmount).toHaveBeenCalledWith('');

    expect(result).toEqual({
      response: mockEmptyResponse,
      formattedFromAmount: '',
      error: undefined,
    });
  });

  it('should handle swap errors correctly', async () => {
    const mockError = {
      code: 'UNCAUGHT_SWAP_QUOTE_ERROR',
      error: 'Something went wrong',
      message: '',
    };

    (getSwapQuote as Mock).mockResolvedValue(mockError);
    (isSwapError as unknown as Mock).mockReturnValue(true);

    const result = await getBuyQuote({
      amount: '1',
      from: fromToken,
      maxSlippage: '0.5',
      to: toToken,
      useAggregator: true,
      fromSwapUnit: mockFromSwapUnit,
    });

    expect(isSwapError).toHaveBeenCalledWith(mockError);
    expect(result).toEqual({
      response: undefined,
      formattedFromAmount: '',
      error: mockError,
    });
  });

  it('should not call `getSwapQuote` if `from` and `to` tokens are the same', async () => {
    const result = await getBuyQuote({
      amount: '1',
      amountReference: 'from' as const,
      from: fromToken,
      maxSlippage: '0.5',
      to: fromToken,
      useAggregator: true,
      fromSwapUnit: mockFromSwapUnit,
    });

    expect(getSwapQuote).not.toHaveBeenCalled();
    expect(result).toEqual({
      response: undefined,
      formattedFromAmount: '',
      error: undefined,
    });
  });
});
