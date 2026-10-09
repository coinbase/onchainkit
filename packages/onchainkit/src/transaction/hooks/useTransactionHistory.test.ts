import { renderHook, waitFor } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount } from 'wagmi';
import { useOnchainKit } from '@/useOnchainKit';
import { useTransactionHistory } from './useTransactionHistory';

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
}));

vi.mock('@/useOnchainKit', () => ({
  useOnchainKit: vi.fn(),
}));

vi.mock('../utils/getTransactionHistory', () => ({
  getTransactionHistory: vi.fn(),
}));

import { getTransactionHistory } from '../utils/getTransactionHistory';

describe('useTransactionHistory', () => {
  const mockAddress = '0x1234567890123456789012345678901234567890';

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return empty state when no address is provided', () => {
    (useAccount as Mock).mockReturnValue({ address: undefined });
    (useOnchainKit as Mock).mockReturnValue({ apiKey: null });

    const { result } = renderHook(() => useTransactionHistory());

    expect(result.current.transactions).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasMore).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should fetch transaction history for connected wallet', async () => {
    const mockTransactions = [
      {
        hash: '0xabc',
        status: 'success' as const,
        timestamp: 1700000000000,
        from: mockAddress,
        to: '0xdef',
        value: '1000000000000000000',
      },
    ];

    (useAccount as Mock).mockReturnValue({ address: mockAddress });
    (useOnchainKit as Mock).mockReturnValue({ apiKey: 'test-api-key' });
    (getTransactionHistory as Mock).mockResolvedValue({
      transactions: mockTransactions,
      hasMore: false,
    });

    const { result } = renderHook(() => useTransactionHistory());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.transactions).toEqual(mockTransactions);
    expect(result.current.hasMore).toBe(false);
    expect(result.current.error).toBeNull();
    expect(getTransactionHistory).toHaveBeenCalledWith(
      expect.objectContaining({ address: mockAddress, limit: 20 }),
      'test-api-key',
    );
  });

  it('should use prop address over connected address', async () => {
    const propAddress = '0x9999999999999999999999999999999999999999';

    (useAccount as Mock).mockReturnValue({ address: mockAddress });
    (useOnchainKit as Mock).mockReturnValue({ apiKey: null });
    (getTransactionHistory as Mock).mockResolvedValue({
      transactions: [],
      hasMore: false,
    });

    renderHook(() => useTransactionHistory({ address: propAddress }));

    await waitFor(() => expect(getTransactionHistory).toHaveBeenCalled());

    expect(getTransactionHistory).toHaveBeenCalledWith(
      expect.objectContaining({ address: propAddress }),
      undefined,
    );
  });

  it('should handle API error', async () => {
    const mockError = {
      code: 'TmTH01',
      error: 'API Error',
      message: 'Failed to fetch',
    };

    (useAccount as Mock).mockReturnValue({ address: mockAddress });
    (useOnchainKit as Mock).mockReturnValue({ apiKey: null });
    (getTransactionHistory as Mock).mockResolvedValue(mockError);

    const { result } = renderHook(() => useTransactionHistory());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toEqual(mockError);
    expect(result.current.transactions).toEqual([]);
  });

  it('should pass custom limit and sort params', async () => {
    (useAccount as Mock).mockReturnValue({ address: mockAddress });
    (useOnchainKit as Mock).mockReturnValue({ apiKey: null });
    (getTransactionHistory as Mock).mockResolvedValue({
      transactions: [],
      hasMore: false,
    });

    renderHook(() => useTransactionHistory({ limit: 50, sort: 'asc' }));

    await waitFor(() => expect(getTransactionHistory).toHaveBeenCalled());

    expect(getTransactionHistory).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 50, sort: 'asc' }),
      undefined,
    );
  });
});
