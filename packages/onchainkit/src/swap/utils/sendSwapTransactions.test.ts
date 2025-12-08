import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { http, createConfig } from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { mainnet, sepolia } from 'wagmi/chains';
import { mock } from 'wagmi/connectors';
import { setOnchainKitConfig } from '../../core/OnchainKitConfig';
import { Capabilities } from '../../core/constants';
import type { SwapTransaction } from '../types';
import { sendSwapTransactions } from './sendSwapTransactions';

vi.mock('wagmi/actions', () => ({
  waitForTransactionReceipt: vi.fn().mockResolvedValue({
    transactionHash: 'receiptHash',
  }),
}));

describe('sendSwapTransactions', () => {
  const updateLifecycleStatus = vi.fn();
  let sendTransactionAsync: Mock;
  let sendCallsAsync: Mock;
  const mockTransactionReceipt = {
    transactionHash: 'receiptHash',
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

  beforeEach(() => {
    vi.clearAllMocks();

    setOnchainKitConfig({
      apiKey: 'test',
    });

    sendTransactionAsync = vi
      .fn()
      .mockResolvedValueOnce('txHash1')
      .mockResolvedValueOnce('txHash2')
      .mockResolvedValueOnce('txHash3');

    sendCallsAsync = vi.fn().mockResolvedValue({ id: 'callsId' });
  });

  it('should execute atomic batch transactions when supported', async () => {
    const transactions: SwapTransaction[] = [
      {
        transaction: { to: '0x123', value: 0n, data: '0x' },
        transactionType: 'Permit2',
      },
      {
        transaction: { to: '0x456', value: 0n, data: '0x' },
        transactionType: 'ERC20',
      },
      {
        transaction: { to: '0x789', value: 0n, data: '0x' },
        transactionType: 'Swap',
      },
    ];
    await sendSwapTransactions({
      config,
      sendTransactionAsync,
      sendCallsAsync,
      updateLifecycleStatus,
      walletCapabilities: { [Capabilities.AtomicBatch]: { supported: true } },
      transactions,
    });
    expect(sendCallsAsync).toHaveBeenCalledTimes(1);
    expect(sendCallsAsync).toHaveBeenCalledWith({
      calls: transactions.map(({ transaction }) => transaction),
      capabilities: {},
    });
    expect(updateLifecycleStatus).toHaveBeenCalledTimes(2);
    expect(updateLifecycleStatus).toHaveBeenNthCalledWith(1, {
      statusName: 'transactionPending',
    });
    expect(updateLifecycleStatus).toHaveBeenNthCalledWith(2, {
      statusName: 'transactionApproved',
      statusData: {
        callsId: 'callsId',
        transactionType: 'Batched',
      },
    });
  });

  it('should sponsor transactions when supported', async () => {
    const transactions: SwapTransaction[] = [
      {
        transaction: { to: '0x123', value: 0n, data: '0x' },
        transactionType: 'Permit2',
      },
      {
        transaction: { to: '0x456', value: 0n, data: '0x' },
        transactionType: 'ERC20',
      },
      {
        transaction: { to: '0x789', value: 0n, data: '0x' },
        transactionType: 'Swap',
      },
    ];
    await sendSwapTransactions({
      config,
      sendTransactionAsync,
      sendCallsAsync,
      isSponsored: true,
      updateLifecycleStatus,
      walletCapabilities: { [Capabilities.AtomicBatch]: { supported: true } },
      transactions,
      paymaster: 'paymaster-url',
    });
    expect(sendCallsAsync).toHaveBeenCalledTimes(1);
    expect(sendCallsAsync).toHaveBeenCalledWith({
      calls: transactions.map(({ transaction }) => transaction),
      capabilities: {
        paymasterService: {
          url: 'paymaster-url',
        },
      },
    });
    expect(updateLifecycleStatus).toHaveBeenCalledTimes(2);
    expect(updateLifecycleStatus).toHaveBeenNthCalledWith(1, {
      statusName: 'transactionPending',
    });
    expect(updateLifecycleStatus).toHaveBeenNthCalledWith(2, {
      statusName: 'transactionApproved',
      statusData: {
        callsId: 'callsId',
        transactionType: 'Batched',
      },
    });
  });

  it('should execute non-batched transactions sequentially', async () => {
    const transactions: SwapTransaction[] = [
      {
        transaction: { to: '0x123', value: 0n, data: '0x' },
        transactionType: 'ERC20',
      },
      {
        transaction: { to: '0x456', value: 0n, data: '0x' },
        transactionType: 'Swap',
      },
    ];
    await sendSwapTransactions({
      config,
      sendTransactionAsync,
      sendCallsAsync,
      updateLifecycleStatus,
      walletCapabilities: { [Capabilities.AtomicBatch]: { supported: false } },
      transactions,
    });
    expect(sendTransactionAsync).toHaveBeenCalledTimes(2);
    expect(waitForTransactionReceipt).toHaveBeenCalledTimes(2);
    expect(updateLifecycleStatus).toHaveBeenCalledTimes(5);
    expect(updateLifecycleStatus).toHaveBeenNthCalledWith(1, {
      statusName: 'transactionPending',
    });
    expect(updateLifecycleStatus).toHaveBeenNthCalledWith(2, {
      statusName: 'transactionApproved',
      statusData: {
        transactionHash: 'txHash1',
        transactionType: 'ERC20',
      },
    });
    expect(updateLifecycleStatus).toHaveBeenNthCalledWith(3, {
      statusName: 'transactionPending',
    });
    expect(updateLifecycleStatus).toHaveBeenNthCalledWith(4, {
      statusName: 'transactionApproved',
      statusData: {
        transactionHash: 'txHash2',
        transactionType: 'Swap',
      },
    });
    expect(updateLifecycleStatus).toHaveBeenNthCalledWith(5, {
      statusName: 'success',
      statusData: {
        transactionReceipt: mockTransactionReceipt,
      },
    });
  });

  it('should handle Permit2 approval process', async () => {
    const transactions: SwapTransaction[] = [
      {
        transaction: { to: '0x123', value: 0n, data: '0x' },
        transactionType: 'Permit2',
      },
      {
        transaction: { to: '0x456', value: 0n, data: '0x' },
        transactionType: 'ERC20',
      },
      {
        transaction: { to: '0x789', value: 0n, data: '0x' },
        transactionType: 'Swap',
      },
    ];
    await sendSwapTransactions({
      config,
      sendTransactionAsync,
      sendCallsAsync,
      updateLifecycleStatus,
      walletCapabilities: { [Capabilities.AtomicBatch]: { supported: false } },
      transactions,
    });
    expect(sendTransactionAsync).toHaveBeenCalledTimes(3);
    expect(waitForTransactionReceipt).toHaveBeenCalledTimes(3);
    expect(updateLifecycleStatus).toHaveBeenCalledTimes(7);
    expect(updateLifecycleStatus).toHaveBeenNthCalledWith(1, {
      statusName: 'transactionPending',
    });
    expect(updateLifecycleStatus).toHaveBeenNthCalledWith(2, {
      statusName: 'transactionApproved',
      statusData: {
        transactionHash: 'txHash1',
        transactionType: 'Permit2',
      },
    });
    expect(updateLifecycleStatus).toHaveBeenNthCalledWith(3, {
      statusName: 'transactionPending',
    });
    expect(updateLifecycleStatus).toHaveBeenNthCalledWith(4, {
      statusName: 'transactionApproved',
      statusData: {
        transactionHash: 'txHash2',
        transactionType: 'ERC20',
      },
    });
    expect(updateLifecycleStatus).toHaveBeenNthCalledWith(5, {
      statusName: 'transactionPending',
    });
    expect(updateLifecycleStatus).toHaveBeenNthCalledWith(6, {
      statusName: 'transactionApproved',
      statusData: {
        transactionHash: 'txHash3',
        transactionType: 'Swap',
      },
    });
    expect(updateLifecycleStatus).toHaveBeenNthCalledWith(7, {
      statusName: 'success',
      statusData: {
        transactionReceipt: mockTransactionReceipt,
      },
    });
  });
});
