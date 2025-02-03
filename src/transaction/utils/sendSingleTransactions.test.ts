import { http, encodeFunctionData, erc20Abi } from 'viem';
import { baseSepolia } from 'viem/chains';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { createConfig } from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { mock } from 'wagmi/connectors';
import type { Call } from '../types';
import { sendSingleTransactions } from './sendSingleTransactions';

vi.mock('viem', async (importOriginal) => {
  const actual = await importOriginal<typeof import('viem')>();
  return {
    ...actual,
    encodeFunctionData: vi.fn(),
  };
});
vi.mock('wagmi/actions', () => ({
  waitForTransactionReceipt: vi.fn().mockResolvedValue({
    transactionHash: 'receiptHash',
  }),
}));

const mockConfig = createConfig({
  chains: [baseSepolia],
  connectors: [
    mock({
      accounts: ['0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'],
    }),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
});

describe('sendSingleTransactions', () => {
  const mockSendCallAsync = vi.fn();
  const transactions: Call[] = [
    { to: '0x123', data: '0x456' },
    { to: '0x789', data: '0xabc' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (encodeFunctionData as Mock).mockReturnValue('123');
  });

  it('should call sendCallAsync for each transaction when type is TRANSACTION_TYPE_CALLS', async () => {
    await sendSingleTransactions({
      config: mockConfig,
      sendCallAsync: mockSendCallAsync,
      transactions,
    });
    expect(mockSendCallAsync).toHaveBeenCalledTimes(2);
    expect(mockSendCallAsync).toHaveBeenNthCalledWith(1, transactions[0]);
    expect(mockSendCallAsync).toHaveBeenNthCalledWith(2, transactions[1]);
  });

  it('should call sendCallAsync for each transaction', async () => {
    await sendSingleTransactions({
      config: mockConfig,
      sendCallAsync: mockSendCallAsync,
      transactions,
    });
    expect(mockSendCallAsync).toHaveBeenCalled();
  });

  it('should not call any function if transactions array is empty', async () => {
    await sendSingleTransactions({
      config: mockConfig,
      sendCallAsync: mockSendCallAsync,
      transactions: [],
    });
    expect(mockSendCallAsync).not.toHaveBeenCalled();
  });

  it('should handle mixed transaction types correctly', async () => {
    await sendSingleTransactions({
      config: mockConfig,
      sendCallAsync: mockSendCallAsync,
      transactions,
    });
    await sendSingleTransactions({
      config: mockConfig,
      sendCallAsync: mockSendCallAsync,
      transactions,
    });
    expect(mockSendCallAsync).toHaveBeenCalledTimes(4);
  });

  it('should transform contracts to calls', async () => {
    await sendSingleTransactions({
      config: mockConfig,
      sendCallAsync: mockSendCallAsync,
      transactions: [
        { abi: erc20Abi, address: '0x123', functionName: 'transfer' },
      ],
    });
    expect(mockSendCallAsync).toHaveBeenCalledWith({
      data: '123',
      to: '0x123',
    });
  });

  it('should wait for transaction receipt when txHash is returned', async () => {
    const transactions: Call[] = [{ to: '0x123', data: '0x456' }];
    mockSendCallAsync.mockResolvedValueOnce('0xhash');

    await sendSingleTransactions({
      config: mockConfig,
      sendCallAsync: mockSendCallAsync,
      transactions,
    });

    expect(waitForTransactionReceipt).toHaveBeenCalledWith(mockConfig, {
      hash: '0xhash',
      confirmations: 1,
    });
  });

  it('should skip waiting for receipt when txHash is null', async () => {
    const transactions: Call[] = [{ to: '0x123', data: '0x456' }];
    mockSendCallAsync.mockResolvedValueOnce(null);

    await sendSingleTransactions({
      config: mockConfig,
      sendCallAsync: mockSendCallAsync,
      transactions,
    });

    expect(waitForTransactionReceipt).not.toHaveBeenCalled();
  });
});
