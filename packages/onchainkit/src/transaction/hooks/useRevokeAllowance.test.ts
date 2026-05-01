import { renderHook } from '@testing-library/react';
import { type Mock, describe, expect, it, vi } from 'vitest';
import { useWriteContract } from 'wagmi';
import { useRevokeAllowance } from './useRevokeAllowance';

vi.mock('wagmi', () => ({
  useWriteContract: vi.fn(),
}));

describe('useRevokeAllowance', () => {
  it('should call approve with 0 to revoke', async () => {
    const mockWriteContract = vi.fn();
    
    (useWriteContract as Mock).mockReturnValue({
      writeContractAsync: mockWriteContract,
      isPending: false,
    });

    const { result } = renderHook(() => useRevokeAllowance());

    await result.current.revoke({
      token: '0xUSDC0000000000000000000000000000000000000',
      spender: '0xSPENDER0000000000000000000000000000000000',
    });

    expect(mockWriteContract).toHaveBeenCalledWith({
      address: '0xUSDC0000000000000000000000000000000000000',
      abi: expect.any(Array),
      functionName: 'approve',
      args: ['0xSPENDER0000000000000000000000000000000000', 0n],
    });
  });

  it('should expose isRevoking state', () => {
    (useWriteContract as Mock).mockReturnValue({
      writeContractAsync: vi.fn(),
      isPending: true,
    });

    const { result } = renderHook(() => useRevokeAllowance());

    expect(result.current.isRevoking).toBe(true);
  });
});
