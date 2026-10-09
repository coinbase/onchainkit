import { renderHook, waitFor } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount } from 'wagmi';
import { useOnchainKit } from '@/useOnchainKit';
import { useTokenAllowance } from './useTokenAllowance';

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
}));

vi.mock('@/useOnchainKit', () => ({
  useOnchainKit: vi.fn(),
}));

vi.mock('../utils/getTokenAllowance', () => ({
  getTokenAllowance: vi.fn(),
}));

import { getTokenAllowance } from '../utils/getTokenAllowance';

describe('useTokenAllowance', () => {
  const mockOwner = '0x1234567890123456789012345678901234567890';
  const mockToken = '0xUSDC0000000000000000000000000000000000000';
  const mockSpender = '0xSPENDER0000000000000000000000000000000000';

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return empty state when no owner', () => {
    (useAccount as Mock).mockReturnValue({ address: undefined });
    (useOnchainKit as Mock).mockReturnValue({ chain: { id: 8453 } });

    const { result } = renderHook(() => useTokenAllowance());

    expect(result.current.allowances).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('should fetch allowances for tokens and spenders', async () => {
    const mockAllowance = {
      token: mockToken,
      spender: mockSpender,
      amount: '1000000000',
      isInfinite: false,
    };

    (useAccount as Mock).mockReturnValue({ address: mockOwner });
    (useOnchainKit as Mock).mockReturnValue({ chain: { id: 8453 } });
    (getTokenAllowance as Mock).mockResolvedValue(mockAllowance);

    const { result } = renderHook(() =>
      useTokenAllowance({
        tokens: [mockToken],
        spenders: [mockSpender],
      })
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.allowances).toHaveLength(1);
    expect(result.current.allowances[0].amount).toBe('1000000000');
    expect(result.current.allowances[0].isInfinite).toBe(false);
  });

  it('should detect infinite allowance', async () => {
    const mockAllowance = {
      token: mockToken,
      spender: mockSpender,
      amount: '115792089237316195423570985008687907853269984665640564039457584007913129639935',
      isInfinite: true,
    };

    (useAccount as Mock).mockReturnValue({ address: mockOwner });
    (useOnchainKit as Mock).mockReturnValue({ chain: { id: 8453 } });
    (getTokenAllowance as Mock).mockResolvedValue(mockAllowance);

    const { result } = renderHook(() =>
      useTokenAllowance({
        tokens: [mockToken],
        spenders: [mockSpender],
      })
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.allowances[0].isInfinite).toBe(true);
  });

  it('should handle API error', async () => {
    const mockError = {
      code: 'TmTA01',
      error: 'Read error',
      message: 'Failed to read allowance',
    };

    (useAccount as Mock).mockReturnValue({ address: mockOwner });
    (useOnchainKit as Mock).mockReturnValue({ chain: { id: 8453 } });
    (getTokenAllowance as Mock).mockResolvedValue(mockError);

    const { result } = renderHook(() =>
      useTokenAllowance({
        tokens: [mockToken],
        spenders: [mockSpender],
      })
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toEqual(mockError);
  });
});
