import { renderHook, waitFor } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useOnchainKit } from '@/useOnchainKit';
import { useContractVerification } from './useContractVerification';

vi.mock('@/useOnchainKit', () => ({
  useOnchainKit: vi.fn(),
}));

vi.mock('../utils/getContractVerification', () => ({
  getContractVerification: vi.fn(),
}));

import { getContractVerification } from '../utils/getContractVerification';

describe('useContractVerification', () => {
  const mockAddress = '0x1234567890123456789012345678901234567890';

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return default state when no address is provided', () => {
    (useOnchainKit as Mock).mockReturnValue({ apiKey: null });

    const { result } = renderHook(() => useContractVerification());

    expect(result.current.isVerified).toBe(false);
    expect(result.current.isProxy).toBe(false);
    expect(result.current.proxyTarget).toBeNull();
    expect(result.current.risk).toBe('high');
    expect(result.current.warnings).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should fetch verification data for verified contract', async () => {
    const mockData = {
      isVerified: true,
      isProxy: false,
      proxyTarget: null,
      contractName: 'MyToken',
      sourceCode: 'pragma solidity ^0.8.0; ...',
      compilerVersion: 'v0.8.19',
      deployedAt: null,
      deployer: '0xabcdef...',
      risk: 'low' as const,
      warnings: [],
    };

    (useOnchainKit as Mock).mockReturnValue({ apiKey: 'test-key' });
    (getContractVerification as Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useContractVerification({ address: mockAddress }));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isVerified).toBe(true);
    expect(result.current.contractName).toBe('MyToken');
    expect(result.current.risk).toBe('low');
    expect(result.current.error).toBeNull();
    expect(getContractVerification).toHaveBeenCalledWith(mockAddress, 'test-key');
  });

  it('should handle unverified contract (high risk)', async () => {
    const mockData = {
      isVerified: false,
      isProxy: false,
      proxyTarget: null,
      contractName: null,
      sourceCode: null,
      compilerVersion: null,
      deployedAt: null,
      deployer: null,
      risk: 'high' as const,
      warnings: ['Contract source code is not verified'],
    };

    (useOnchainKit as Mock).mockReturnValue({ apiKey: null });
    (getContractVerification as Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useContractVerification({ address: mockAddress }));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isVerified).toBe(false);
    expect(result.current.risk).toBe('high');
    expect(result.current.warnings).toContain('Contract source code is not verified');
  });

  it('should handle proxy contract', async () => {
    const mockData = {
      isVerified: true,
      isProxy: true,
      proxyTarget: '0x9999999999999999999999999999999999999999',
      contractName: 'Proxy',
      sourceCode: '...',
      compilerVersion: 'v0.8.19',
      deployedAt: null,
      deployer: '0xaaa...',
      risk: 'low' as const,
      warnings: [],
    };

    (useOnchainKit as Mock).mockReturnValue({ apiKey: null });
    (getContractVerification as Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useContractVerification({ address: mockAddress }));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isProxy).toBe(true);
    expect(result.current.proxyTarget).toBe('0x9999999999999999999999999999999999999999');
  });

  it('should handle API error', async () => {
    const mockError = {
      code: 'TmCV01',
      error: 'API Error',
      message: 'Failed to verify contract',
    };

    (useOnchainKit as Mock).mockReturnValue({ apiKey: null });
    (getContractVerification as Mock).mockResolvedValue(mockError);

    const { result } = renderHook(() => useContractVerification({ address: mockAddress }));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toEqual(mockError);
  });

  it('should refetch when address changes', async () => {
    (useOnchainKit as Mock).mockReturnValue({ apiKey: null });
    (getContractVerification as Mock).mockResolvedValue({
      isVerified: true,
      isProxy: false,
      proxyTarget: null,
      contractName: 'Token1',
      sourceCode: '...',
      compilerVersion: 'v0.8.19',
      deployedAt: null,
      deployer: null,
      risk: 'low' as const,
      warnings: [],
    });

    const { result, rerender } = renderHook(
      ({ address }) => useContractVerification({ address }),
      { initialProps: { address: mockAddress } }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(getContractVerification).toHaveBeenCalledTimes(1);

    rerender({ address: '0x9999999999999999999999999999999999999999' });

    await waitFor(() => expect(getContractVerification).toHaveBeenCalledTimes(2));
  });
});
