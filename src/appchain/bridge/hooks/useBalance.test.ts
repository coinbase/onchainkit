import { getNewReactQueryTestProvider } from '@/identity/hooks/getNewReactQueryTestProvider';
import { renderHook, waitFor } from '@testing-library/react';
import { getBalance } from '@wagmi/core';
import type { Address } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useConfig } from 'wagmi';
import { readContract } from 'wagmi/actions';
import { useBalance } from './useBalances';

vi.mock('@wagmi/core', () => ({
  getBalance: vi.fn(),
}));

vi.mock('wagmi/actions', () => ({
  readContract: vi.fn(),
}));

vi.mock('wagmi', () => ({
  useConfig: vi.fn(),
}));

const wrapper = getNewReactQueryTestProvider();

const mockToken = {
  address: '0x123',
  decimals: 18,
  chainId: 1,
  image: '',
  name: 'Mock Token',
  symbol: 'MOCK',
} as const;

describe('useBalance', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (useConfig as ReturnType<typeof vi.fn>).mockReturnValue({
      testConfig: true,
    });
    (getBalance as ReturnType<typeof vi.fn>).mockResolvedValue({
      value: BigInt(1000000000000000000),
      decimals: 18,
    });
    (readContract as ReturnType<typeof vi.fn>).mockResolvedValue(
      BigInt(2000000000000000000),
    );
  });

  it('should return empty string when address is not provided', () => {
    const { result } = renderHook(
      () => useBalance({ token: mockToken, chainId: 1 }),
      { wrapper },
    );
    expect(result.current).toBe('');
  });

  it('should fetch native token balance correctly', async () => {
    const { result } = renderHook(
      () =>
        useBalance({
          address: '0x789',
          token: { ...mockToken, address: '' },
          chainId: 1,
        }),
      { wrapper },
    );
    await waitFor(() => {
      expect(result.current).toBe('1');
    });
    expect(getBalance).toHaveBeenCalledWith(
      { testConfig: true },
      {
        address: '0x789',
        chainId: 1,
      },
    );
  });

  it('should fetch ERC20 token balance correctly', async () => {
    const { result } = renderHook(
      () =>
        useBalance({
          address: '0x789',
          token: mockToken,
          chainId: 1,
        }),
      { wrapper },
    );
    await waitFor(() => {
      expect(result.current).toBe('2');
    });
    expect(readContract).toHaveBeenCalledWith(
      { testConfig: true },
      {
        abi: expect.any(Array),
        functionName: 'balanceOf',
        args: ['0x789'],
        address: '0x123',
        chainId: 1,
      },
    );
  });

  it('should update balance when dependencies change', async () => {
    const { result, rerender } = renderHook(
      ({ address, token, chainId }) =>
        useBalance({ address: address as Address, token, chainId }),
      {
        wrapper,
        initialProps: {
          address: '0x789',
          token: mockToken,
          chainId: 1,
        },
      },
    );
    await waitFor(() => {
      expect(result.current).toBe('2');
    });

    (readContract as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      BigInt(3000000000000000000),
    );

    rerender({
      address: '0x789',
      token: { ...mockToken, address: '0x123' },
      chainId: 1,
    });

    await waitFor(() => {
      expect(result.current).toBe('3');
    });
  });
});
