import { processSwapTransaction } from './SwapProvider';
import { BuildSwapTransaction } from '../types';
import { createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { mock } from 'wagmi/connectors';
import { describe, expect, it, vi } from 'vitest';

describe('processSwapTransaction', () => {
  it('should request approval and make the swap for ERC-20 tokens', async () => {
    const swapTransaction: BuildSwapTransaction = {
      transaction: {
        to: '0x123',
        value: 0n,
        data: '0x',
        chainId: 8453,
        gas: 0n,
      },
      approveTransaction: {
        to: '0x456',
        value: 0n,
        data: '0x123',
        chainId: 8453,
        gas: 0n,
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
        hasHighPriceImpact: false,
        slippage: '3',
        warning: undefined,
      },
      fee: {
        baseAsset: {
          name: 'DEGEN',
          address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
          symbol: 'DEGEN',
          decimals: 18,
          image:
            'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/3b/bf/3bbf118b5e6dc2f9e7fc607a6e7526647b4ba8f0bea87125f971446d57b296d2-MDNmNjY0MmEtNGFiZi00N2I0LWIwMTItMDUyMzg2ZDZhMWNm',
          chainId: 8453,
        },
        percentage: '1',
        amount: '195912661817282562',
      },
    };
    const config = createConfig({
      chains: [mainnet, sepolia],
      connectors: [
        mock({
          accounts: [
            '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
            '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
            '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
          ],
        }),
      ],
      transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
      },
    });
    const setPendingTransaction = vi.fn();
    const setLoading = vi.fn();
    const sendTransactionAsync = vi.fn().mockResolvedValue('approveTxHash');
    const waitForTransactionReceipt = vi.fn().mockResolvedValue({});
    const onSuccess = vi.fn();

    await processSwapTransaction({
      swapTransaction,
      config,
      setPendingTransaction,
      setLoading,
      sendTransactionAsync,
      onSuccess,
    });

    expect(setPendingTransaction).toHaveBeenCalledTimes(2);
    expect(setPendingTransaction).toHaveBeenCalledWith(true);
    expect(setPendingTransaction).toHaveBeenCalledWith(false);
    expect(sendTransactionAsync).toHaveBeenCalledTimes(1);
    expect(sendTransactionAsync).toHaveBeenCalledWith({
      to: '0x456',
      value: '0',
      data: '0x123',
    });
    expect(waitForTransactionReceipt).toHaveBeenCalledTimes(1);
    expect(waitForTransactionReceipt).toHaveBeenCalledWith(config, {
      hash: 'approveTxHash',
      confirmations: 1,
    });
    expect(setLoading).toHaveBeenCalledTimes(1);
    expect(setLoading).toHaveBeenCalledWith(true);
    expect(setLoading).toHaveBeenCalledWith(false);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith({});
  });

  it('should make the swap for non-ERC-20 tokens', async () => {
    const swapTransaction: BuildSwapTransaction = {
      transaction: {
        to: '0x123',
        value: 0n,
        data: '0x',
        chainId: 8453,
        gas: 0n,
      },
      approveTransaction: undefined,
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
        hasHighPriceImpact: false,
        slippage: '3',
        warning: undefined,
      },
      fee: {
        baseAsset: {
          name: 'DEGEN',
          address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
          symbol: 'DEGEN',
          decimals: 18,
          image:
            'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/3b/bf/3bbf118b5e6dc2f9e7fc607a6e7526647b4ba8f0bea87125f971446d57b296d2-MDNmNjY0MmEtNGFiZi00N2I0LWIwMTItMDUyMzg2ZDZhMWNm',
          chainId: 8453,
        },
        percentage: '1',
        amount: '195912661817282562',
      },
    };
    const config = createConfig({
      chains: [mainnet, sepolia],
      connectors: [
        mock({
          accounts: [
            '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
            '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
            '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
          ],
        }),
      ],
      transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
      },
    });
    const setPendingTransaction = vi.fn();
    const setLoading = vi.fn();
    const sendTransactionAsync = vi.fn().mockResolvedValue('txHash');
    const waitForTransactionReceipt = vi.fn().mockResolvedValue({});
    const onSuccess = vi.fn();

    await processSwapTransaction({
      swapTransaction,
      config,
      setPendingTransaction,
      setLoading,
      sendTransactionAsync,
      onSuccess,
    });

    expect(setPendingTransaction).toHaveBeenCalledTimes(2);
    expect(setPendingTransaction).toHaveBeenCalledWith(true);
    expect(setPendingTransaction).toHaveBeenCalledWith(false);
    expect(sendTransactionAsync).toHaveBeenCalledTimes(1);
    expect(sendTransactionAsync).toHaveBeenCalledWith({
      to: '0x123',
      value: '0',
      data: '0x',
    });
    expect(waitForTransactionReceipt).toHaveBeenCalledTimes(1);
    expect(waitForTransactionReceipt).toHaveBeenCalledWith(config, {
      hash: 'txHash',
      confirmations: 1,
    });
    expect(setLoading).toHaveBeenCalledTimes(1);
    expect(setLoading).toHaveBeenCalledWith(true);
    expect(setLoading).toHaveBeenCalledWith(false);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith({});
  });
});
