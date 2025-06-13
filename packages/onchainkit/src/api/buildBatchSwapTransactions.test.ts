import { RequestContext } from '@/core/network/constants';
import { CDP_GET_SWAP_TRADE } from '@/core/network/definitions/swap';
import { sendRequest } from '@/core/network/request';
import { SwapMessage } from '@/swap/constants';
import { UNSUPPORTED_AMOUNT_REFERENCE_ERROR_CODE } from '@/swap/constants';
import { DEGEN_TOKEN, ETH_TOKEN } from '@/swap/mocks';
import type { Address } from 'viem';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { buildBatchSwapTransactions } from './buildBatchSwapTransactions';
import { getAPIParamsForToken } from './utils/getAPIParamsForToken';

vi.mock('@/core/network/request');

const testFromAddress: Address = '0x6Cd01c0F55ce9E0Bf78f5E90f72b4345b16d515d';
const testAmount = '3305894409732200';
const testAmountReference = 'from' as const;

describe('buildBatchSwapTransactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return multiple swaps in a batch', async () => {
    const mockParams = [
      {
        useAggregator: true,
        fromAddress: testFromAddress,
        amountReference: testAmountReference,
        from: ETH_TOKEN,
        to: DEGEN_TOKEN,
        amount: testAmount,
      },
      {
        useAggregator: true,
        fromAddress: testFromAddress,
        amountReference: testAmountReference,
        from: DEGEN_TOKEN,
        to: ETH_TOKEN,
        amount: testAmount,
      },
    ];

    const mockApiParams = mockParams.map((params) =>
      getAPIParamsForToken(params),
    );

    const mockResponse = [
      {
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
            from: ETH_TOKEN,
            to: DEGEN_TOKEN,
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
      },
      {
        id: 2,
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
            from: DEGEN_TOKEN,
            to: ETH_TOKEN,
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
              name: 'ETH',
              address: '0x0000000000000000000000000000000000000000',
              currencyCode: 'ETH',
              decimals: 18,
              imageURL:
                'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
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
      },
    ];

    (sendRequest as Mock).mockResolvedValue(mockResponse);

    const expectedBatchRequests = mockApiParams.map((apiParams, index) => ({
      jsonrpc: '2.0',
      id: index + 1,
      method: CDP_GET_SWAP_TRADE,
      params: [apiParams],
    }));

    const results = await buildBatchSwapTransactions(mockParams);
    expect(results).toHaveLength(2);
    expect(results[0]).toHaveProperty('transaction');
    expect(results[1]).toHaveProperty('transaction');
    expect(sendRequest).toHaveBeenCalledTimes(1);
    expect(sendRequest).toHaveBeenCalledWith(
      'batch',
      expectedBatchRequests,
      RequestContext.API,
    );
  });

  it('should handle errors in batch requests', async () => {
    const mockParams = [
      {
        useAggregator: true,
        fromAddress: testFromAddress,
        amountReference: 'to' as const,
        from: ETH_TOKEN,
        to: DEGEN_TOKEN,
        amount: testAmount,
      },
      {
        useAggregator: true,
        fromAddress: testFromAddress,
        amountReference: testAmountReference,
        from: ETH_TOKEN,
        to: DEGEN_TOKEN,
        amount: testAmount,
      },
    ];

    const results = await buildBatchSwapTransactions(mockParams);
    expect(results).toHaveLength(2);
    expect(results[0]).toEqual({
      code: UNSUPPORTED_AMOUNT_REFERENCE_ERROR_CODE,
      error: SwapMessage.UNSUPPORTED_AMOUNT_REFERENCE,
      message: '',
    });
    expect(sendRequest).not.toHaveBeenCalled();
  });

  it('should handle API errors in batch responses', async () => {
    const mockParams = [
      {
        useAggregator: true,
        fromAddress: testFromAddress,
        amountReference: testAmountReference,
        from: ETH_TOKEN,
        to: DEGEN_TOKEN,
        amount: testAmount,
      },
    ];

    const mockResponse = [
      {
        id: 1,
        jsonrpc: '2.0',
        error: {
          code: 'SWAP_ERROR',
          message: 'Invalid response',
        },
      },
    ];

    (sendRequest as Mock).mockResolvedValue(mockResponse);

    const results = await buildBatchSwapTransactions(mockParams);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      code: 'SWAP_ERROR',
      error: 'Invalid response',
      message: '',
    });
  });

  it('should handle network errors', async () => {
    const mockParams = [
      {
        useAggregator: true,
        fromAddress: testFromAddress,
        amountReference: testAmountReference,
        from: ETH_TOKEN,
        to: DEGEN_TOKEN,
        amount: testAmount,
      },
    ];

    (sendRequest as Mock).mockRejectedValue(new Error('Network error'));

    const results = await buildBatchSwapTransactions(mockParams);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      code: 'UNCAUGHT_SWAP_ERROR',
      error: 'Something went wrong',
      message: '',
    });
  });
});
