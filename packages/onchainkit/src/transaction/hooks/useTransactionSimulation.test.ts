import { renderHook, waitFor } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount, useConfig } from 'wagmi';
import { useOnchainKit } from '@/useOnchainKit';
import { useTransactionContext } from '../components/TransactionProvider';
import { useTransactionSimulation } from './useTransactionSimulation';

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  useConfig: vi.fn(),
}));

vi.mock('@/useOnchainKit', () => ({
  useOnchainKit: vi.fn(),
}));

vi.mock('../components/TransactionProvider', () => ({
  useTransactionContext: vi.fn(),
}));

vi.mock('../utils/simulateTransaction', () => ({
  simulateTransaction: vi.fn(),
}));

import { simulateTransaction } from '../utils/simulateTransaction';

describe('useTransactionSimulation', () => {
  const mockConfig = { chains: [{ id: 8453 }] };
  const mockAddress = '0x1234567890123456789012345678901234567890';
  const mockChain = { id: 8453 };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return null when disabled', () => {
    (useAccount as Mock).mockReturnValue({ address: mockAddress });
    (useConfig as Mock).mockReturnValue(mockConfig);
    (useOnchainKit as Mock).mockReturnValue({ chain: mockChain });
    (useTransactionContext as Mock).mockReturnValue({
      calls: [{ to: '0xCONTRACT', data: '0x1234' }],
    });

    const { result } = renderHook(() => useTransactionSimulation({ enabled: false }));

    expect(result.current.simulation).toBeNull();
    expect(result.current.isSimulating).toBe(false);
  });

  it('should return null when no calls', () => {
    (useAccount as Mock).mockReturnValue({ address: mockAddress });
    (useConfig as Mock).mockReturnValue(mockConfig);
    (useOnchainKit as Mock).mockReturnValue({ chain: mockChain });
    (useTransactionContext as Mock).mockReturnValue({ calls: [] });

    const { result } = renderHook(() => useTransactionSimulation());

    expect(result.current.simulation).toBeNull();
  });

  it('should simulate successful transaction', async () => {
    const mockSimulation = {
      success: true,
      gasUsed: 21000n,
      returnData: '0x000000000000000000000000000000000000000000000000000000000000002a',
      warnings: [],
    };

    (useAccount as Mock).mockReturnValue({ address: mockAddress });
    (useConfig as Mock).mockReturnValue(mockConfig);
    (useOnchainKit as Mock).mockReturnValue({ chain: mockChain });
    (useTransactionContext as Mock).mockReturnValue({
      calls: [{ to: '0xCONTRACT', data: '0x1234' }],
    });
    (simulateTransaction as Mock).mockResolvedValue(mockSimulation);

    const { result } = renderHook(() => useTransactionSimulation());

    await waitFor(() => expect(result.current.isSimulating).toBe(false));

    expect(result.current.simulation?.success).toBe(true);
    expect(result.current.willFail).toBe(false);
    expect(result.current.gasEstimate).toBe(21000n);
  });

  it('should detect failing transaction', async () => {
    const mockSimulation = {
      success: false,
      gasUsed: 0n,
      errorMessage: 'Transaction will revert — check parameters',
      warnings: ['Transaction will revert — check parameters'],
    };

    (useAccount as Mock).mockReturnValue({ address: mockAddress });
    (useConfig as Mock).mockReturnValue(mockConfig);
    (useOnchainKit as Mock).mockReturnValue({ chain: mockChain });
    (useTransactionContext as Mock).mockReturnValue({
      calls: [{ to: '0xCONTRACT', data: '0x1234' }],
    });
    (simulateTransaction as Mock).mockResolvedValue(mockSimulation);

    const { result } = renderHook(() => useTransactionSimulation());

    await waitFor(() => expect(result.current.isSimulating).toBe(false));

    expect(result.current.willFail).toBe(true);
    expect(result.current.warnings).toContain('Transaction will revert — check parameters');
  });

  it('should handle API error', async () => {
    const mockError = {
      code: 'TmTS01',
      error: 'RPC Error',
      message: 'Simulation failed',
    };

    (useAccount as Mock).mockReturnValue({ address: mockAddress });
    (useConfig as Mock).mockReturnValue(mockConfig);
    (useOnchainKit as Mock).mockReturnValue({ chain: mockChain });
    (useTransactionContext as Mock).mockReturnValue({
      calls: [{ to: '0xCONTRACT', data: '0x1234' }],
    });
    (simulateTransaction as Mock).mockResolvedValue(mockError);

    const { result } = renderHook(() => useTransactionSimulation());

    await waitFor(() => expect(result.current.isSimulating).toBe(false));

    expect(result.current.error).toEqual(mockError);
  });
});
