import { beforeEach, describe, expect, it, vi } from 'vitest';
import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { mock } from 'wagmi/connectors';

import type { BuildSwapTransaction } from '../../api/types';
import { Capabilities } from '../../core/constants';
import { PERMIT2_CONTRACT_ADDRESS } from '../constants';
import { DEGEN_TOKEN, ETH_TOKEN, USDC_TOKEN } from '../mocks';
import { processSwapTransaction } from './processSwapTransaction';
import { sendSwapTransactions } from './sendSwapTransactions';

const mockSendSwapTransactions = vi.fn();

vi.mock('./sendSwapTransactions', () => ({
  sendSwapTransactions: vi.fn(),
}));

describe('processSwapTransaction', () => {
  const mockSwitchChain = vi.fn();
  const mockSendTransactionAsync = vi.fn();
  const mockSendCallsAsync = vi.fn();
  const mockUpdateLifecycleStatus = vi.fn();

  const config = createConfig({
    chains: [base],
    connectors: [
      mock({ accounts: ['0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'] }),
    ],
    transports: { [base.id]: http() },
  });

  beforeEach(() => {
    vi.clearAllMocks();
    (sendSwapTransactions as ReturnType<typeof vi.fn>).mockImplementation(
      mockSendSwapTransactions,
    );
  });

  it('should switch chains if necessary', async () => {
    const swapTransaction: BuildSwapTransaction = {
      transaction: {
        to: '0x123',
        value: 0n,
        data: '0x',
        chainId: 8453,
        gas: 0n,
      },
      approveTransaction: undefined,
      fee: {
        baseAsset: DEGEN_TOKEN,
        percentage: '1',
        amount: '195912661817282562',
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
      },
    } as unknown as BuildSwapTransaction;
    await processSwapTransaction({
      chainId: 1, // Different from base.id (8453)
      config,
      sendTransactionAsync: mockSendTransactionAsync,
      sendCallsAsync: mockSendCallsAsync,
      updateLifecycleStatus: mockUpdateLifecycleStatus,
      swapTransaction,
      switchChainAsync: mockSwitchChain,
      useAggregator: true,
      walletCapabilities: { [Capabilities.AtomicBatch]: { supported: false } },
    });
    expect(mockSwitchChain).toHaveBeenCalledWith({ chainId: base.id });
    expect(mockSendSwapTransactions).toHaveBeenCalled();
  });

  it('should not switch chains if already on the correct chain', async () => {
    const swapTransaction: BuildSwapTransaction = {
      transaction: {
        to: '0x123',
        value: 0n,
        data: '0x',
        chainId: 8453,
        gas: 0n,
      },
      approveTransaction: undefined,
      fee: {
        baseAsset: DEGEN_TOKEN,
        percentage: '1',
        amount: '195912661817282562',
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
      },
    } as unknown as BuildSwapTransaction;
    await processSwapTransaction({
      chainId: base.id, // Same as base.id (8453)
      config,
      sendTransactionAsync: mockSendTransactionAsync,
      sendCallsAsync: mockSendCallsAsync,
      updateLifecycleStatus: mockUpdateLifecycleStatus,
      swapTransaction,
      switchChainAsync: mockSwitchChain,
      useAggregator: true,
      walletCapabilities: { [Capabilities.AtomicBatch]: { supported: false } },
    });
    expect(mockSwitchChain).not.toHaveBeenCalled();
    expect(mockSendSwapTransactions).toHaveBeenCalled();
  });

  it('should handle ERC-20 approval for aggregator (V1 API)', async () => {
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
      fee: {
        baseAsset: DEGEN_TOKEN,
        percentage: '1',
        amount: '195912661817282562',
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
      },
    } as unknown as BuildSwapTransaction;
    await processSwapTransaction({
      chainId: base.id,
      config,
      sendTransactionAsync: mockSendTransactionAsync,
      sendCallsAsync: mockSendCallsAsync,
      updateLifecycleStatus: mockUpdateLifecycleStatus,
      swapTransaction,
      switchChainAsync: mockSwitchChain,
      useAggregator: true,
      walletCapabilities: { [Capabilities.AtomicBatch]: { supported: false } },
    });
    expect(mockSendSwapTransactions).toHaveBeenCalledWith(
      expect.objectContaining({
        transactions: expect.arrayContaining([
          expect.objectContaining({
            transaction: { to: '0x456', data: '0x123', value: 0n },
            transactionType: 'ERC20',
          }),
          expect.objectContaining({
            transaction: { to: '0x123', data: '0x', value: 0n },
            transactionType: 'Swap',
          }),
        ]),
      }),
    );
  });

  it('should handle ERC-20 approval for UniversalRouter (V2 API)', async () => {
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
      fee: {
        baseAsset: DEGEN_TOKEN,
        percentage: '1',
        amount: '195912661817282562',
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
      },
    } as unknown as BuildSwapTransaction;
    await processSwapTransaction({
      chainId: base.id,
      config,
      sendTransactionAsync: mockSendTransactionAsync,
      sendCallsAsync: mockSendCallsAsync,
      updateLifecycleStatus: mockUpdateLifecycleStatus,
      swapTransaction,
      switchChainAsync: mockSwitchChain,
      useAggregator: false,
      walletCapabilities: { [Capabilities.AtomicBatch]: { supported: false } },
    });
    expect(mockSendSwapTransactions).toHaveBeenCalledWith(
      expect.objectContaining({
        transactions: expect.arrayContaining([
          expect.objectContaining({
            transaction: { to: '0x456', data: '0x123', value: 0n },
            transactionType: 'ERC20',
          }),
          expect.objectContaining({
            transaction: {
              to: PERMIT2_CONTRACT_ADDRESS,
              value: 0n,
              data: expect.any(String),
            },
            transactionType: 'Permit2',
          }),
          expect.objectContaining({
            transaction: { to: '0x123', data: '0x', value: 0n },
            transactionType: 'Swap',
          }),
        ]),
      }),
    );
  });
});
