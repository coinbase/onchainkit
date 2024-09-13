import { type Mock, afterEach, describe, expect, it, vi } from 'vitest';
import { CDP_GET_SWAP_QUOTE } from '../network/definitions/swap';
import { sendRequest } from '../network/request';
import { DEGEN_TOKEN, ETH_TOKEN } from '../swap/mocks';
/**
 * @vitest-environment node
 */
import { getSwapQuote } from './getSwapQuote';
import { getAPIParamsForToken } from './utils/getAPIParamsForToken';

vi.mock('../network/request');

const testAmount = '3305894409732200';
const testAmountReference = 'from';

describe('getSwapQuote', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return a quote for a swap', async () => {
    const mockParams = {
      useAggregator: true,
      amountReference: testAmountReference,
      from: ETH_TOKEN,
      to: DEGEN_TOKEN,
      amount: testAmount,
    };
    const mockApiParams = getAPIParamsForToken(mockParams);
    const mockResponse = {
      id: 1,
      jsonrpc: '2.0',
      result: {
        from: ETH_TOKEN,
        to: DEGEN_TOKEN,
        fromAmount: '100000000000000000',
        toAmount: '16732157880511600003860',
        amountReference: 'from',
        priceImpact: '0.07',
        chainId: 8453,
        hasHighPriceImpact: false,
        slippage: '3',
      },
    };
    (sendRequest as Mock).mockResolvedValue(mockResponse);
    const quote = await getSwapQuote(mockParams);
    expect(quote).toEqual(mockResponse.result);
    expect(sendRequest).toHaveBeenCalledTimes(1);
    expect(sendRequest).toHaveBeenCalledWith(CDP_GET_SWAP_QUOTE, [
      mockApiParams,
    ]);
  });

  it('should return a quote for a swap with useAggregator=false', async () => {
    const mockParams = {
      useAggregator: false,
      maxSlippage: '3',
      amountReference: testAmountReference,
      from: ETH_TOKEN,
      to: DEGEN_TOKEN,
      amount: testAmount,
    };
    const mockApiParams = {
      v2Enabled: true,
      ...getAPIParamsForToken(mockParams),
    };
    const mockResponse = {
      id: 1,
      jsonrpc: '2.0',
      result: {
        from: ETH_TOKEN,
        to: DEGEN_TOKEN,
        fromAmount: '100000000000000000',
        toAmount: '16732157880511600003860',
        amountReference: 'from',
        priceImpact: '0.07',
        chainId: 8453,
        hasHighPriceImpact: false,
        slippage: '3',
      },
    };
    (sendRequest as Mock).mockResolvedValue(mockResponse);
    const quote = await getSwapQuote(mockParams);
    expect(quote).toEqual(mockResponse.result);
    expect(sendRequest).toHaveBeenCalledTimes(1);
    expect(sendRequest).toHaveBeenCalledWith(CDP_GET_SWAP_QUOTE, [
      {
        slippagePercentage: '3',
        ...mockApiParams,
      },
    ]);
  });

  it('should return an error if sendRequest fails', async () => {
    const mockParams = {
      useAggregator: true,
      amountReference: testAmountReference,
      from: ETH_TOKEN,
      to: DEGEN_TOKEN,
      amount: testAmount,
    };
    const mockApiParams = getAPIParamsForToken(mockParams);
    const mockError = new Error('getSwapQuote: Error: Failed to send request');
    (sendRequest as Mock).mockRejectedValue(mockError);
    const error = await getSwapQuote(mockParams);
    expect(error).toEqual({
      code: 'UNCAUGHT_SWAP_QUOTE_ERROR',
      error: 'Something went wrong',
      message: '',
    });
    expect(sendRequest).toHaveBeenCalledTimes(1);
    expect(sendRequest).toHaveBeenCalledWith(CDP_GET_SWAP_QUOTE, [
      mockApiParams,
    ]);
  });

  it('should return an error object from getSwapQuote', async () => {
    const mockParams = {
      useAggregator: true,
      amountReference: testAmountReference,
      from: ETH_TOKEN,
      to: DEGEN_TOKEN,
      amount: testAmount,
    };
    const mockApiParams = getAPIParamsForToken(mockParams);
    const mockResponse = {
      id: 1,
      jsonrpc: '2.0',
      error: {
        code: -1,
        message: 'Invalid response',
      },
    };
    (sendRequest as Mock).mockResolvedValue(mockResponse);
    const error = await getSwapQuote(mockParams);
    expect(error).toEqual({
      code: 'SWAP_QUOTE_ERROR',
      error: 'Invalid response',
      message: '',
    });
    expect(sendRequest).toHaveBeenCalledTimes(1);
    expect(sendRequest).toHaveBeenCalledWith(CDP_GET_SWAP_QUOTE, [
      mockApiParams,
    ]);
  });

  it('should return a SwapError from getSwapQuote for invalid `amount` input', async () => {
    const mockParams = {
      useAggregator: true,
      amountReference: testAmountReference,
      from: ETH_TOKEN,
      to: DEGEN_TOKEN,
      amount: 'invalid',
      isAmountInDecimals: false,
    };
    const error = await getSwapQuote(mockParams);
    expect(error).toEqual({
      code: 'INVALID_INPUT',
      error: 'Invalid input: amount must be a non-negative number string',
      message: '',
    });
  });

  it('should adjust slippage for V1 API when useAggregator is true', async () => {
    const mockParams = {
      useAggregator: true,
      maxSlippage: '3',
      amountReference: testAmountReference,
      from: ETH_TOKEN,
      to: DEGEN_TOKEN,
      amount: testAmount,
    };
    const mockApiParams = getAPIParamsForToken(mockParams);
    const mockResponse = {
      id: 1,
      jsonrpc: '2.0',
      result: {
        from: ETH_TOKEN,
        to: DEGEN_TOKEN,
        fromAmount: '100000000000000000',
        toAmount: '16732157880511600003860',
        amountReference: 'from',
        priceImpact: '0.07',
        chainId: 8453,
        hasHighPriceImpact: false,
        slippage: '30',
      },
    };
    (sendRequest as Mock).mockResolvedValue(mockResponse);
    await getSwapQuote(mockParams);
    expect(sendRequest).toHaveBeenCalledTimes(1);
    expect(sendRequest).toHaveBeenCalledWith(CDP_GET_SWAP_QUOTE, [
      {
        ...mockApiParams,
        slippagePercentage: '30',
      },
    ]);
  });

  it('should not adjust slippage when useAggregator is false', async () => {
    const mockParams = {
      useAggregator: false,
      maxSlippage: '3',
      amountReference: testAmountReference,
      from: ETH_TOKEN,
      to: DEGEN_TOKEN,
      amount: testAmount,
    };
    const mockApiParams = getAPIParamsForToken(mockParams);
    const mockResponse = {
      id: 1,
      jsonrpc: '2.0',
      result: {
        from: ETH_TOKEN,
        to: DEGEN_TOKEN,
        fromAmount: '100000000000000000',
        toAmount: '16732157880511600003860',
        amountReference: 'from',
        priceImpact: '0.07',
        chainId: 8453,
        hasHighPriceImpact: false,
        slippage: '3',
      },
    };
    (sendRequest as Mock).mockResolvedValue(mockResponse);
    await getSwapQuote(mockParams);
    expect(sendRequest).toHaveBeenCalledTimes(1);
    expect(sendRequest).toHaveBeenCalledWith(CDP_GET_SWAP_QUOTE, [
      {
        ...mockApiParams,
        v2Enabled: true,
        slippagePercentage: '3',
      },
    ]);
  });
});
