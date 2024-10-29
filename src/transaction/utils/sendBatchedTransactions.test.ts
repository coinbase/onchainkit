import { beforeEach, describe, expect, it, vi } from 'vitest';
import { sendBatchedTransactions } from './sendBatchedTransactions';

describe('sendBatchedTransactions', () => {
  const mockSendCallsAsync = vi.fn();
  const mockTransactions = [];
  const mockCapabilities = { paymasterService: '' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call sendCallsAsync for contract transactions', async () => {
    await sendBatchedTransactions({
      capabilities: mockCapabilities,
      sendCallsAsync: mockSendCallsAsync,
      transactions: mockTransactions,
    });
    expect(mockSendCallsAsync).toHaveBeenCalled();
  });

  it('should call sendCallsAsync for call transactions', async () => {
    await sendBatchedTransactions({
      capabilities: mockCapabilities,
      sendCallsAsync: mockSendCallsAsync,
      transactions: mockTransactions,
    });
    expect(mockSendCallsAsync).toHaveBeenCalledWith({
      calls: mockTransactions,
      capabilities: mockCapabilities,
    });
  });

  it('should not call any function if transactions are undefined', async () => {
    await sendBatchedTransactions({
      capabilities: mockCapabilities,
      sendCallsAsync: mockSendCallsAsync,
      transactions: undefined,
    });
    expect(mockSendCallsAsync).not.toHaveBeenCalled();
  });

  it('should transform contracts address prop', async () => {
    await sendBatchedTransactions({
      capabilities: mockCapabilities,
      sendCallsAsync: mockSendCallsAsync,
      transactions: [{ address: '0x123', abi: '123' }],
    });
    expect(mockSendCallsAsync).toHaveBeenCalled({
      Capabilities: mockCapabilities,
      calls: [{ to: '0x123', abi: '123' }],
    });
  });

  it('should transform not transform call', async () => {
    await sendBatchedTransactions({
      capabilities: mockCapabilities,
      sendCallsAsync: mockSendCallsAsync,
      transactions: [{ to: '0x123', data: '123' }],
    });
    expect(mockSendCallsAsync).toHaveBeenCalled({
      Capabilities: mockCapabilities,
      calls: [{ to: '0x123', data: '123' }],
    });
  });
});
