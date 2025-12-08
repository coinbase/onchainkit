import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useFid } from './useFid';

const mockAddress: `0x${string}` = '0x1234567890123456789012345678901234567890';

vi.mock('viem', () => ({
  createPublicClient: vi.fn().mockReturnValue({
    readContract: vi
      .fn()
      .mockResolvedValueOnce(123n)
      .mockResolvedValueOnce(456n),
  }),
  http: vi.fn(),
  optimism: {
    id: 10,
    name: 'Optimism',
  },
}));

vi.mock('viem/chains', () => ({
  optimism: {
    id: 10,
    name: 'Optimism',
  },
}));

describe('useFid', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return null when no address is provided', () => {
    const { result } = renderHook(useFid);

    expect(result.current).toBeNull();
  });

  it('should fetch and return FID when address is provided', async () => {
    const { result } = renderHook(() => useFid(mockAddress));

    expect(result.current).toBeNull();

    await waitFor(() => {
      expect(result.current).toBe(123);
    });
  });
});
