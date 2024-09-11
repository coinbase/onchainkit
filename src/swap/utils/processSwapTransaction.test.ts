import { beforeEach, describe, expect, it, vi } from 'vitest';
import { http, createConfig } from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { mainnet, sepolia } from 'wagmi/chains';
import { mock } from 'wagmi/connectors';
import { PERMIT2_CONTRACT_ADDRESS } from '../constants';
import { DEGEN_TOKEN, ETH_TOKEN, USDC_TOKEN } from '../mocks';
import type { BuildSwapTransaction, LifeCycleStatus } from '../types';
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
  const sendTransactionAsyncPermit2 = vi
    .fn()
    .mockResolvedValueOnce('approveTxHash')
    .mockResolvedValueOnce('permit2TxHash')
    .mockResolvedValueOnce('txHash');

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

  const defaultLifeCycleStatus: LifeCycleStatus = {
    statusName: 'init',
    statusData: {
      isMissingRequiredField: false,
      maxSlippage: 3,
    },
  };

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
    await processSwapTransaction({
      config,
      sendTransactionAsync,
      setLifeCycleStatus,
      swapTransaction,
      useAggregator: true,
      lifeCycleStatus: defaultLifeCycleStatus,
    });
    expect(setLifeCycleStatus).toHaveBeenCalledTimes(4);
    expect(setLifeCycleStatus).toHaveBeenNthCalledWith(1, {
      statusName: 'transactionPending',
      statusData: {
        isMissingRequiredField: false,
        maxSlippage: 3,
      },
    });
    expect(setLifeCycleStatus).toHaveBeenNthCalledWith(2, {
      statusName: 'transactionApproved',
      statusData: {
        transactionHash: 'approveTxHash',
        transactionType: 'ERC20',
        // LifecycleStatus shared data
        isMissingRequiredField: false,
        maxSlippage: 3,
      },
    });
    expect(setLifeCycleStatus).toHaveBeenNthCalledWith(3, {
      statusName: 'transactionPending',
      statusData: {
        // LifecycleStatus shared data
        isMissingRequiredField: false,
        maxSlippage: 3,
      },
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
    await processSwapTransaction({
      config,
      sendTransactionAsync,
      setLifeCycleStatus,
      swapTransaction,
      useAggregator: true,
      lifeCycleStatus: defaultLifeCycleStatus,
    });
    expect(setLifeCycleStatus).toHaveBeenCalledTimes(2);
    expect(setLifeCycleStatus).toHaveBeenNthCalledWith(1, {
      statusName: 'transactionPending',
      statusData: {
        // LifecycleStatus shared data
        isMissingRequiredField: false,
        maxSlippage: 3,
      },
    });
    expect(sendTransactionAsync).toHaveBeenCalledTimes(1);
    expect(waitForTransactionReceipt).toHaveBeenCalledTimes(1);
  });

  it('should successfully use Permit2 approval process for `useAggregator`=false', async () => {
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
    await processSwapTransaction({
      config,
      sendTransactionAsync: sendTransactionAsyncPermit2,
      setLifeCycleStatus,
      swapTransaction,
      useAggregator: false,
      lifeCycleStatus: defaultLifeCycleStatus,
    });
    expect(setLifeCycleStatus).toHaveBeenCalledTimes(6);
    expect(setLifeCycleStatus).toHaveBeenNthCalledWith(1, {
      statusName: 'transactionPending',
      statusData: {
        // LifecycleStatus shared data
        isMissingRequiredField: false,
        maxSlippage: 3,
      },
    });
    expect(setLifeCycleStatus).toHaveBeenNthCalledWith(2, {
      statusName: 'transactionApproved',
      statusData: {
        transactionHash: 'approveTxHash',
        transactionType: 'Permit2',
        // LifecycleStatus shared data
        isMissingRequiredField: false,
        maxSlippage: 3,
      },
    });
    expect(setLifeCycleStatus).toHaveBeenNthCalledWith(3, {
      statusName: 'transactionPending',
      statusData: {
        // LifecycleStatus shared data
        isMissingRequiredField: false,
        maxSlippage: 3,
      },
    });
    expect(setLifeCycleStatus).toHaveBeenNthCalledWith(4, {
      statusName: 'transactionApproved',
      statusData: {
        transactionHash: 'permit2TxHash',
        transactionType: 'ERC20',
        // LifecycleStatus shared data
        isMissingRequiredField: false,
        maxSlippage: 3,
      },
    });
    expect(sendTransactionAsyncPermit2).toHaveBeenCalledTimes(3);
    expect(waitForTransactionReceipt).toHaveBeenCalledTimes(3);
    expect(sendTransactionAsyncPermit2).toHaveBeenNthCalledWith(2, {
      to: PERMIT2_CONTRACT_ADDRESS,
      data: expect.any(String),
      value: 0n,
    });
  });

  it('should use default maxSlippage when lifeCycleStatus is error', async () => {
    const errorLifeCycleStatus: LifeCycleStatus = {
      statusName: 'error',
      statusData: {
        code: 'UNKNOWN_ERROR',
        error: 'Some error occurred',
        message: 'Some error occurred',
        // LifecycleStatus shared data
        isMissingRequiredField: false,
        maxSlippage: 3,
      },
    };
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
    await processSwapTransaction({
      config,
      sendTransactionAsync,
      setLifeCycleStatus,
      swapTransaction,
      useAggregator: true,
      lifeCycleStatus: errorLifeCycleStatus,
    });
    expect(setLifeCycleStatus).toHaveBeenCalledTimes(2);
    expect(setLifeCycleStatus).toHaveBeenNthCalledWith(1, {
      statusName: 'transactionPending',
      statusData: {
        // LifecycleStatus shared data
        isMissingRequiredField: false,
        maxSlippage: 3,
      },
    });
    expect(sendTransactionAsync).toHaveBeenCalledTimes(1);
    expect(waitForTransactionReceipt).toHaveBeenCalledTimes(1);
  });
});
