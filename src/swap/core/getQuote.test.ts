import { getQuote } from './getQuote';
import { sendRequest } from '../../queries/request';

jest.mock('../../queries/request');

describe('getQuote', () => {
  it('should return a quote for a swap', async () => {
    const mockParams = {
      amountReference: 'from',
      from: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
      to: '0xcd2f22236dd9dfe2356d7c543161d4d260fd9bcb',
      amount: '3305894409732200',
    };

    const mockResponse = {
      id: 1,
      jsonrpc: '2.0',
      result: {
        fromAsset: {
          name: 'ETH',
          address: '',
          currencyCode: 'ETH',
          decimals: 18,
          imageURL: 'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
          blockchain: 'eth',
          aggregators: ['zeroex', '1inch'],
          swappable: true,
          unverified: false,
          chainId: 8453,
        },
        toAsset: {
          name: 'DEGEN',
          address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
          currencyCode: 'DEGEN',
          decimals: 18,
          imageURL:
            'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/3b/bf/3bbf118b5e6dc2f9e7fc607a6e7526647b4ba8f0bea87125f971446d57b296d2-MDNmNjY0MmEtNGFiZi00N2I0LWIwMTItMDUyMzg2ZDZhMWNm',
          blockchain: 'eth',
          aggregators: ['1inch', 'zeroex'],
          swappable: true,
          unverified: false,
          chainId: 8453,
        },
        fromAmount: '100000000000000000',
        toAmount: '16732157880511600003860',
        amountReference: 'from',
        priceImpact: '0.07',
        chainId: 8453,
        highPriceImpact: false,
        slippage: '3',
      },
    };

    (sendRequest as jest.Mock).mockResolvedValue(mockResponse);

    const quote = await getQuote(mockParams);

    expect(quote).toEqual(mockResponse.result);
  });

  it('should throw an error if sendRequest fails', async () => {
    const mockParams = {
      amountReference: 'from',
      from: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
      to: '0xcd2f22236dd9dfe2356d7c543161d4d260fd9bcb',
      amount: '3305894409732200',
    };

    const mockError = new Error('Failed to send request');
    (sendRequest as jest.Mock).mockRejectedValue(mockError);

    await expect(getQuote(mockParams)).rejects.toThrowError(mockError);
  });

  it('should throw an error if the response does not have a result', async () => {
    const mockParams = {
      amountReference: 'from',
      from: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
      to: '0xcd2f22236dd9dfe2356d7c543161d4d260fd9bcb',
      amount: '3305894409732200',
    };

    const mockResponse = {
      id: 1,
      jsonrpc: '2.0',
      error: {
        code: -1,
        message: 'Invalid response',
      },
    };

    (sendRequest as jest.Mock).mockResolvedValue(mockResponse);

    await expect(getQuote(mockParams)).rejects.toThrowError('Invalid response');
  });
});
