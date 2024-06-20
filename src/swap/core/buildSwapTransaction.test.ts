import { getAPIParamsForToken } from './getAPIParamsForToken';
import { buildSwapTransaction } from './buildSwapTransaction';
import { getSwapTransaction } from './getSwapTransaction';
import { sendRequest } from '../../network/request';
import { CDP_GET_SWAP_TRADE } from '../../network/definitions/swap';
import type { Token } from '../../token/types';
import type { BuildSwapTransaction } from '../types';

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
const testFromAddress = '0x6Cd01c0F55ce9E0Bf78f5E90f72b4345b16d515d';
const testAmount = '3305894409732200';
const testAmountReference = 'from';

describe('buildSwapTransaction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a swap', async () => {
    const mockParams = {
      fromAddress: testFromAddress as `0x${string}`,
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
        tx: {
          data: '0x0000000000000',
          gas: '463613',
          gasPrice: '2106527',
          from: '0xaeE5834a78a30F6762407F6F8c3A2090054b0086',
          to: '0xdef1c0ded9bec7f1a1670819833240f027b25eff',
          value: '100000000000000',
        },
        quote: {
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
          fromAmount: '100000000000000',
          toAmount: '19395353519910973703',
          amountReference: 'from',
          priceImpact: '0.94',
          chainId: 8453,
          highPriceImpact: false,
          slippage: '3',
          warning: undefined,
        },
        fee: {
          baseAsset: {
            name: 'DEGEN',
            address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
            currencyCode: 'DEGEN',
            decimals: 18,
            imageURL:
              'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/3b/bf/3bbf118b5e6dc2f9e7fc607a6e7526647b4ba8f0bea87125f971446d57b296d2-MDNmNjY0MmEtNGFiZi00N2I0LWIwMTItMDUyMzg2ZDZhMWNm',
            blockchain: 'eth',
            aggregators: [Array],
            swappable: true,
            unverified: false,
            chainId: 8453,
          },
          percentage: '1',
          amount: '195912661817282562',
        },
        approveTx: undefined,
        chainId: '8453',
      },
    };

    (sendRequest as jest.Mock).mockResolvedValue(mockResponse);

    const trade = mockResponse.result;
    const expectedResponse = {
      approveTransaction: trade.approveTx
        ? getSwapTransaction(trade.approveTx, trade.chainId)
        : undefined,
      fee: trade.fee,
      quote: trade.quote,
      transaction: getSwapTransaction(trade.tx, trade.chainId),
      warning: trade.quote.warning,
    };

    const quote = (await buildSwapTransaction(
      mockParams,
    )) as BuildSwapTransaction;

    expect(quote.approveTransaction).toEqual(
      expectedResponse.approveTransaction,
    );
    expect(quote.transaction).toEqual(expectedResponse.transaction);
    expect(quote.fee).toEqual(expectedResponse.fee);
    expect(quote.warning).toEqual(expectedResponse.warning);

    expect(sendRequest).toHaveBeenCalledTimes(1);
    expect(sendRequest).toHaveBeenCalledWith(CDP_GET_SWAP_TRADE, [
      mockApiParams,
    ]);
  });

  it('should return a swap with an approve transaction', async () => {
    const mockParams = {
      fromAddress: testFromAddress as `0x${string}`,
      amountReference: testAmountReference,
      from: DEGEN,
      to: ETH,
      amount: testAmount,
    };
    const mockApiParams = getAPIParamsForToken(mockParams);

    const mockResponse = {
      id: 1,
      jsonrpc: '2.0',
      result: {
        approveTx: {
          data: '0x0000000000000',
          gas: '463613',
          gasPrice: '2106527',
          from: '0xaeE5834a78a30F6762407F6F8c3A2090054b0086',
          to: '0xdef1c0ded9bec7f1a1670819833240f027b25eff',
          value: '100000000000000',
        },
        tx: {
          data: '0x0000000000000',
          gas: '463613',
          gasPrice: '2106527',
          from: '0xaeE5834a78a30F6762407F6F8c3A2090054b0086',
          to: '0xdef1c0ded9bec7f1a1670819833240f027b25eff',
          value: '100000000000000',
        },
        quote: {
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
          fromAmount: '100000000000000',
          toAmount: '19395353519910973703',
          amountReference: 'from',
          priceImpact: '0.94',
          chainId: 8453,
          highPriceImpact: false,
          slippage: '3',
          warning: undefined,
        },
        fee: {
          baseAsset: {
            name: 'DEGEN',
            address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
            currencyCode: 'DEGEN',
            decimals: 18,
            imageURL:
              'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/3b/bf/3bbf118b5e6dc2f9e7fc607a6e7526647b4ba8f0bea87125f971446d57b296d2-MDNmNjY0MmEtNGFiZi00N2I0LWIwMTItMDUyMzg2ZDZhMWNm',
            blockchain: 'eth',
            aggregators: [Array],
            swappable: true,
            unverified: false,
            chainId: 8453,
          },
          percentage: '1',
          amount: '195912661817282562',
        },
        chainId: '8453',
      },
    };

    (sendRequest as jest.Mock).mockResolvedValue(mockResponse);

    const trade = mockResponse.result;
    const expectedResponse = {
      approveTransaction: trade.approveTx
        ? getSwapTransaction(trade.approveTx, trade.chainId)
        : undefined,
      fee: trade.fee,
      quote: trade.quote,
      transaction: getSwapTransaction(trade.tx, trade.chainId),
      warning: trade.quote.warning,
    };

    const quote = (await buildSwapTransaction(
      mockParams,
    )) as BuildSwapTransaction;

    expect(quote.approveTransaction).toEqual(
      expectedResponse.approveTransaction,
    );
    expect(quote.transaction).toEqual(expectedResponse.transaction);
    expect(quote.fee).toEqual(expectedResponse.fee);
    expect(quote.warning).toEqual(expectedResponse.warning);

    expect(sendRequest).toHaveBeenCalledTimes(1);
    expect(sendRequest).toHaveBeenCalledWith(CDP_GET_SWAP_TRADE, [
      mockApiParams,
    ]);
  });

  it('should return an error if sendRequest fails', async () => {
    const mockParams = {
      fromAddress: testFromAddress as `0x${string}`,
      amountReference: testAmountReference,
      from: ETH,
      to: DEGEN,
      amount: testAmount,
    };
    const mockApiParams = getAPIParamsForToken(mockParams);

    const mockError = new Error(
      'buildSwapTransaction: Error: Failed to send request',
    );
    (sendRequest as jest.Mock).mockRejectedValue(mockError);

    const error = await buildSwapTransaction(mockParams);
    expect(error).toEqual({
      code: 'UNCAUGHT_SWAP_ERROR',
      error: 'Something went wrong',
    });

    expect(sendRequest).toHaveBeenCalledTimes(1);
    expect(sendRequest).toHaveBeenCalledWith(CDP_GET_SWAP_TRADE, [
      mockApiParams,
    ]);
  });

  it('should return an error object from buildSwapTransaction', async () => {
    const mockParams = {
      fromAddress: testFromAddress as `0x${string}`,
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
        code: 'SWAP_ERROR',
        message: 'Invalid response',
      },
    };

    (sendRequest as jest.Mock).mockResolvedValue(mockResponse);

    const error = await buildSwapTransaction(mockParams);
    expect(error).toEqual({
      code: 'SWAP_ERROR',
      error: 'Invalid response',
    });

    expect(sendRequest).toHaveBeenCalledTimes(1);
    expect(sendRequest).toHaveBeenCalledWith(CDP_GET_SWAP_TRADE, [
      mockApiParams,
    ]);
  });
});
