import { beforeEach, describe, expect, it, vi } from 'vitest';
import { http, createConfig } from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { mainnet, sepolia } from 'wagmi/chains';
import { mock } from 'wagmi/connectors';
import { DEGEN_TOKEN, ETH_TOKEN, USDC_TOKEN } from '../mocks';
import type { BuildSwapTransaction } from '../types';
import { processSwapTransaction } from './processSwapTransaction';

vi.mock('wagmi/actions', () => ({
  waitForTransactionReceipt: vi.fn().mockResolvedValue({}),
}));

describe('processSwapTransaction', () => {
  const setLifeCycleStatus = vi.fn();
  const sendTransactionAsync = vi
    .fn()
    .mockResolvedValueOnce('approveTxHash')
    .mockResolvedValueOnce('txHash');
  const sendTransactionAsync2 = vi
    .fn()
    .mockResolvedValueOnce('approveTxHash')
    .mockResolvedValueOnce('txHash');
  const sendTransactionAsyncPermit2 = vi
    .fn()
    .mockResolvedValueOnce('approveTxHash')
    .mockResolvedValueOnce('permit2TxHash')
    .mockResolvedValueOnce('txHash');

  beforeEach(() => {
    vi.clearAllMocks();
  });

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
        baseAsset: DEGEN_TOKEN,
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
    await processSwapTransaction({
      config,
      sendTransactionAsync,
      setLifeCycleStatus,
      swapTransaction,
      useAggregator: true,
    });
    expect(setLifeCycleStatus).toHaveBeenCalledTimes(4);
    expect(setLifeCycleStatus).toHaveBeenCalledWith({
      statusName: 'transactionPending',
      statusData: null,
    });
    expect(sendTransactionAsync).toHaveBeenCalledTimes(2);
    expect(waitForTransactionReceipt).toHaveBeenCalledTimes(2);
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
        from: ETH_TOKEN,
        to: DEGEN_TOKEN,
        fromAmount: '100000000000000',
        toAmount: '19395353519910973703',
        amountReference: 'from',
        priceImpact: '0.94',
        hasHighPriceImpact: false,
        slippage: '3',
        warning: undefined,
      },
      fee: {
        baseAsset: DEGEN_TOKEN,
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
    await processSwapTransaction({
      config,
      sendTransactionAsync,
      setLifeCycleStatus,
      swapTransaction,
      useAggregator: true,
    });
    expect(setLifeCycleStatus).toHaveBeenCalledTimes(2);
    expect(setLifeCycleStatus).toHaveBeenCalledWith({
      statusName: 'swapPending',
      statusData: null,
    });
    expect(sendTransactionAsync).toHaveBeenCalledTimes(1);
    expect(waitForTransactionReceipt).toHaveBeenCalledTimes(1);
  });

  it('should successfully call relevant async lifecycle hooks', async () => {
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
        from: ETH_TOKEN,
        to: DEGEN_TOKEN,
        fromAmount: '100000000000000',
        toAmount: '19395353519910973703',
        amountReference: 'from',
        priceImpact: '0.94',
        hasHighPriceImpact: false,
        slippage: '3',
        warning: undefined,
      },
      fee: {
        baseAsset: DEGEN_TOKEN,
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
    await processSwapTransaction({
      config,
      sendTransactionAsync: sendTransactionAsync2,
      setLifeCycleStatus,
      swapTransaction,
      useAggregator: true,
    });
    expect(setLifeCycleStatus).toHaveBeenCalledTimes(4);
    expect(setLifeCycleStatus).toHaveBeenCalledWith({
      statusName: 'transactionPending',
      statusData: null,
    });
    expect(sendTransactionAsync2).toHaveBeenCalledTimes(2);
    expect(waitForTransactionReceipt).toHaveBeenCalledTimes(2);
  });

  it('should successfully use Permit2 approval process for `useAggregators`=false', async () => {
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
        from: USDC_TOKEN,
        to: DEGEN_TOKEN,
        fromAmount: '100000000000000',
        toAmount: '19395353519910973703',
        amountReference: 'from',
        priceImpact: '0.94',
        hasHighPriceImpact: false,
        slippage: '3',
        warning: undefined,
      },
      fee: {
        baseAsset: DEGEN_TOKEN,
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
    await processSwapTransaction({
      config,
      sendTransactionAsync: sendTransactionAsyncPermit2,
      setLifeCycleStatus,
      swapTransaction,
      useAggregator: false,
    });
    expect(setLifeCycleStatus).toHaveBeenCalledTimes(6);
    expect(setLifeCycleStatus).toHaveBeenCalledWith({
      statusName: 'transactionPending',
      statusData: null,
    });
    expect(sendTransactionAsyncPermit2).toHaveBeenCalledTimes(3);
    expect(waitForTransactionReceipt).toHaveBeenCalledTimes(3);
  });
});
