import { getSwapQuote } from './getSwapQuote';
import { sendRequest } from '../../network/request';
import { CDP_GET_SWAP_QUOTE } from '../../network/definitions/swap';
import { getAPIParamsForToken } from './getAPIParamsForToken';
import type { Token } from '../../token/types';

jest.mock('../../network/request');

const ETH: Token = {
  name: 'ETH',
  address: '',
  symbol: 'ETH',
  decimals: 18,
  image:
    'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
  chainId: 8453,
};
const DEGEN: Token = {
  name: 'DEGEN',
  address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
  symbol: 'DEGEN',
  decimals: 18,
  image:
    'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/3b/bf/3bbf118b5e6dc2f9e7fc607a6e7526647b4ba8f0bea87125f971446d57b296d2-MDNmNjY0MmEtNGFiZi00N2I0LWIwMTItMDUyMzg2ZDZhMWNm',
  chainId: 8453,
};
const testAmount = '3305894409732200';
const testAmountReference = 'from';

describe('getSwapQuote', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a quote for a swap', async () => {
    const mockParams = {
      amountReference: testAmountReference,
      from: ETH,
      to: DEGEN,
      amount: testAmount,
    };
    const mockApiParams = getAPIParamsForToken(mockParams);

    const mockResponse = {
      id: 1,
      jsonrpc: '2.0',
      result: {
        from: {
          address: '',
          chainId: 8453,
          decimals: 18,
          image:
            'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
          name: 'ETH',
          symbol: 'ETH',
        },
        to: {
          address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
          chainId: 8453,
          decimals: 18,
          image:
            'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/3b/bf/3bbf118b5e6dc2f9e7fc607a6e7526647b4ba8f0bea87125f971446d57b296d2-MDNmNjY0MmEtNGFiZi00N2I0LWIwMTItMDUyMzg2ZDZhMWNm',
          name: 'DEGEN',
          symbol: 'DEGEN',
        },
        fromAmount: '100000000000000000',
        toAmount: '16732157880511600003860',
        amountReference: 'from',
        priceImpact: '0.07',
        chainId: 8453,
        hasHighPriceImpact: false,
        slippage: '3',
      },
    };

    (sendRequest as jest.Mock).mockResolvedValue(mockResponse);

    const quote = await getSwapQuote(mockParams);

    expect(quote).toEqual(mockResponse.result);

    expect(sendRequest).toHaveBeenCalledTimes(1);
    expect(sendRequest).toHaveBeenCalledWith(CDP_GET_SWAP_QUOTE, [
      mockApiParams,
    ]);
  });

  it('should return an error if sendRequest fails', async () => {
    const mockParams = {
      amountReference: testAmountReference,
      from: ETH,
      to: DEGEN,
      amount: testAmount,
    };
    const mockApiParams = getAPIParamsForToken(mockParams);

    const mockError = new Error('getSwapQuote: Error: Failed to send request');
    (sendRequest as jest.Mock).mockRejectedValue(mockError);

    const error = await getSwapQuote(mockParams);
    expect(error).toEqual({
      code: 'UNCAUGHT_SWAP_QUOTE_ERROR',
      error: 'Something went wrong',
    });

    expect(sendRequest).toHaveBeenCalledTimes(1);
    expect(sendRequest).toHaveBeenCalledWith(CDP_GET_SWAP_QUOTE, [
      mockApiParams,
    ]);
  });

  it('should return an error object from getSwapQuote', async () => {
    const mockParams = {
      amountReference: testAmountReference,
      from: ETH,
      to: DEGEN,
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

    (sendRequest as jest.Mock).mockResolvedValue(mockResponse);

    const error = await getSwapQuote(mockParams);
    expect(error).toEqual({
      code: 'SWAP_QUOTE_ERROR',
      error: 'Invalid response',
    });

    expect(sendRequest).toHaveBeenCalledTimes(1);
    expect(sendRequest).toHaveBeenCalledWith(CDP_GET_SWAP_QUOTE, [
      mockApiParams,
    ]);
  });
});
