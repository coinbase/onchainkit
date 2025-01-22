import { publicClient } from '@/core/network/client';
import { getChainPublicClient } from '@/core/network/getChainPublicClient';
import { renderHook, waitFor } from '@testing-library/react';
import { base, baseSepolia, mainnet } from 'viem/chains';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { getNewReactQueryTestProvider } from './getNewReactQueryTestProvider';
import { useAddress } from './useAddress';

vi.mock('@/core/network/client');

vi.mock('@/core/network/getChainPublicClient', () => ({
  ...vi.importActual('@/core/network/getChainPublicClient'),
  getChainPublicClient: vi.fn(() => publicClient),
}));

describe('useAddress', () => {
  const mockGetEnsAddress = publicClient.getEnsAddress as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return the correct address and loading state', async () => {
    const testEnsName = 'test.ens';
    const testEnsAddress = '0x1234';
    mockGetEnsAddress.mockResolvedValue(testEnsAddress);
    const { result } = renderHook(() => useAddress({ name: testEnsName }), {
      wrapper: getNewReactQueryTestProvider(),
    });
    await waitFor(() => {
      expect(result.current.data).toBe(testEnsAddress);
      expect(result.current.isLoading).toBe(false);
    });
    expect(getChainPublicClient).toHaveBeenCalledWith(mainnet);
  });

  it('should return the loading state true while still fetching ENS address', async () => {
    const testEnsName = 'test.ens';
    const { result } = renderHook(() => useAddress({ name: testEnsName }), {
      wrapper: getNewReactQueryTestProvider(),
    });
    await waitFor(() => {
      expect(result.current.data).toBe(undefined);
      expect(result.current.isLoading).toBe(true);
    });
  });

  it('should return correct base mainnet address', async () => {
    const testEnsName = 'shrek.base.eth';
    const testEnsAddress = '0x1234';
    mockGetEnsAddress.mockResolvedValue(testEnsAddress);
    const { result } = renderHook(
      () => useAddress({ name: testEnsName, chain: base }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );
    await waitFor(() => {
      expect(result.current.data).toBe(testEnsAddress);
      expect(result.current.isLoading).toBe(false);
    });
    expect(getChainPublicClient).toHaveBeenCalledWith(base);
  });

  it('should return correct base sepolia address', async () => {
    const testEnsName = 'shrek.basetest.eth';
    const testEnsAddress = '0x1234';
    mockGetEnsAddress.mockResolvedValue(testEnsAddress);
    const { result } = renderHook(
      () => useAddress({ name: testEnsName, chain: baseSepolia }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );
    await waitFor(() => {
      expect(result.current.data).toBe(testEnsAddress);
      expect(result.current.isLoading).toBe(false);
    });
    expect(getChainPublicClient).toHaveBeenCalledWith(baseSepolia);
  });
});
