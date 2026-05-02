import { renderHook, waitFor } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useConfig } from 'wagmi';
import { useOnchainKit } from '@/useOnchainKit';
import { useTransactionContext } from '../components/TransactionProvider';
import { useGasEstimator } from './useGasEstimator';

vi.mock('wagmi', () => ({
  useConfig: vi.fn(),
}));

vi.mock('@/useOnchainKit', () => ({
  useOnchainKit: vi.fn(),
}));

vi.mock('../components/TransactionProvider', () => ({
  useTransactionContext: vi.fn(),
}));

vi.mock('../utils/estimateGas', () => ({
  estimateGasFee: vi.fn(),
}));

import { estimateGasFee } from '../utils/estimateGas';

describe('useGasEstimator', () => {
  const mockConfig = { chains: [{ id: 8453 }] };
  const mockChain = { id: 8453 };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return null when no calls', () => {
    (useConfig as Mock).mockReturnValue(mockConfig);
    (useOnchainKit as Mock).mockReturnValue({ chain: mockChain });
    (useTransactionContext as Mock).mockReturnValue({ calls: [] });
    (estimateGasFee as Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useGasEstimator());

    expect(result.current.estimatedFee).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should estimate gas for calls', async () => {
    const mockEstimate = {
      estimatedFee: '0.0001',
      maxFee: '0.00015',
      gasUnits: 21000n,
      gasPrice: 5000000000n,
      isSpike: false,
      isSafe: true,
      waitTimeMinutes: undefined,
    };

    (useConfig as Mock).mockReturnValue(mockConfig);
    (useOnchainKit as Mock).mockReturnValue({ chain: mockChain });
    (useTransactionContext as Mock).mockReturnValue({
      calls: [{ to: '0x1234567890123456789012345678901234567890' }],
    });
    (estimateGasFee as Mock).mockResolvedValue(mockEstimate);

    const { result } = renderHook(() => useGasEstimator());

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 });

    expect(result.current.estimatedFee).toBe('0.0001');
    expect(result.current.isSafe).toBe(true);
    expect(result.current.isSpike).toBe(false);
  });

  it('should detect gas spike', async () => {
    const mockEstimate = {
      estimatedFee: '0.005',
      maxFee: '0.0075',
      gasUnits: 21000n,
      gasPrice: 50000000000n,
      isSpike: true,
      isSafe: false,
      waitTimeMinutes: 3,
    };

    (useConfig as Mock).mockReturnValue(mockConfig);
    (useOnchainKit as Mock).mockReturnValue({ chain: mockChain });
    (useTransactionContext as Mock).mockReturnValue({
      calls: [{ to: '0x1234567890123456789012345678901234567890' }],
    });
    (estimateGasFee as Mock).mockResolvedValue(mockEstimate);

    const { result } = renderHook(() => useGasEstimator());

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 });

    expect(result.current.isSpike).toBe(true);
    expect(result.current.waitTimeMinutes).toBe(3);
  });

  it('should handle API error', async () => {
    const mockError = {
      code: 'TmGE01',
      error: 'RPC Error',
      message: 'Failed to estimate gas',
    };

    (useConfig as Mock).mockReturnValue(mockConfig);
    (useOnchainKit as Mock).mockReturnValue({ chain: mockChain });
    (useTransactionContext as Mock).mockReturnValue({
      calls: [{ to: '0x1234567890123456789012345678901234567890' }],
    });
    (estimateGasFee as Mock).mockResolvedValue(mockError);

    const { result } = renderHook(() => useGasEstimator());

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 });

    expect(result.current.error).toEqual(mockError);
  });
});
