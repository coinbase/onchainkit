import { renderHook, waitFor } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useOnchainKit } from '@/useOnchainKit';
import { useWalletRisk } from './useWalletRisk';

vi.mock('@/useOnchainKit', () => ({
  useOnchainKit: vi.fn(),
}));

vi.mock('../utils/getWalletRisk', () => ({
  getWalletRisk: vi.fn(),
}));

import { getWalletRisk } from '../utils/getWalletRisk';

describe('useWalletRisk', () => {
  const mockAddress = '0x1234567890123456789012345678901234567890';

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return default state when no address', () => {
    (useOnchainKit as Mock).mockReturnValue({ apiKey: null });

    const { result } = renderHook(() => useWalletRisk());

    expect(result.current.risk).toBe('low');
    expect(result.current.flags).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('should analyze new wallet (high risk)', async () => {
    const mockRisk = {
      risk: 'high' as const,
      flags: ['new_wallet', 'never_received'],
      isContract: false,
      txCount: 0,
    };

    (useOnchainKit as Mock).mockReturnValue({ apiKey: null });
    (getWalletRisk as Mock).mockResolvedValue(mockRisk);

    const { result } = renderHook(() => useWalletRisk({ address: mockAddress }));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.risk).toBe('high');
    expect(result.current.flags).toContain('new_wallet');
    expect(result.current.isContract).toBe(false);
  });

  it('should analyze active wallet (low risk)', async () => {
    const mockRisk = {
      risk: 'low' as const,
      flags: [],
      isContract: false,
      txCount: 150,
      firstTxDate: '2023-01-01T00:00:00Z',
      lastTxDate: '2024-01-01T00:00:00Z',
    };

    (useOnchainKit as Mock).mockReturnValue({ apiKey: 'test-key' });
    (getWalletRisk as Mock).mockResolvedValue(mockRisk);

    const { result } = renderHook(() => useWalletRisk({ address: mockAddress }));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.risk).toBe('low');
    expect(result.current.txCount).toBe(150);
    expect(getWalletRisk).toHaveBeenCalledWith(mockAddress, 'test-key');
  });

  it('should detect contract wallet', async () => {
    const mockRisk = {
      risk: 'medium' as const,
      flags: ['smart_contract'],
      isContract: true,
      txCount: 50,
    };

    (useOnchainKit as Mock).mockReturnValue({ apiKey: null });
    (getWalletRisk as Mock).mockResolvedValue(mockRisk);

    const { result } = renderHook(() => useWalletRisk({ address: mockAddress }));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isContract).toBe(true);
    expect(result.current.flags).toContain('smart_contract');
  });

  it('should handle API error', async () => {
    const mockError = {
      code: 'TmWR01',
      error: 'API Error',
      message: 'Failed to analyze wallet',
    };

    (useOnchainKit as Mock).mockReturnValue({ apiKey: null });
    (getWalletRisk as Mock).mockResolvedValue(mockError);

    const { result } = renderHook(() => useWalletRisk({ address: mockAddress }));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toEqual(mockError);
  });
});
