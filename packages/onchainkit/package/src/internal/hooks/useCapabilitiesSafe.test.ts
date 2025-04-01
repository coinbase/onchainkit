import { renderHook } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount } from 'wagmi';
import { useCapabilities } from 'wagmi/experimental';
import { useCapabilitiesSafe } from './useCapabilitiesSafe';

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
}));

vi.mock('wagmi/experimental', () => ({
  useCapabilities: vi.fn(),
}));

describe('useCapabilitiesSafe', () => {
  const mockChainId = 1;
  const walletCapabilitiesTrue = {
    atomicBatch: { supported: true },
    paymasterService: { supported: true },
    auxiliaryFunds: { supported: true },
  };
  const walletCapabilitiesFalse = {};

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return all capabilities as false when not connected', () => {
    (useAccount as Mock).mockReturnValue({ isConnected: false });
    (useCapabilities as Mock).mockReturnValue({ data: undefined });
    const { result } = renderHook(() =>
      useCapabilitiesSafe({ chainId: mockChainId }),
    );
    expect(result.current).toEqual(walletCapabilitiesFalse);
  });

  it('should return all capabilities as false when there is an error', () => {
    (useAccount as Mock).mockReturnValue({ isConnected: true });
    (useCapabilities as Mock).mockReturnValue({
      data: undefined,
      error: new Error('Some error'),
    });
    const { result } = renderHook(() =>
      useCapabilitiesSafe({ chainId: mockChainId }),
    );
    expect(result.current).toEqual(walletCapabilitiesFalse);
  });

  it('should return correct capabilities when connected', () => {
    (useAccount as Mock).mockReturnValue({
      isConnected: true,
      connector: { id: 'some.other.wallet' },
    });
    (useCapabilities as Mock).mockReturnValue({
      data: {
        1: {
          atomicBatch: { supported: true },
          paymasterService: { supported: true },
          auxiliaryFunds: { supported: true },
        },
      },
    });
    const { result } = renderHook(() =>
      useCapabilitiesSafe({ chainId: mockChainId }),
    );
    expect(result.current).toEqual(walletCapabilitiesTrue);
  });

  it('should handle undefined capabilities', () => {
    (useAccount as Mock).mockReturnValue({
      isConnected: true,
      connector: { id: 'some.other.wallet' },
    });
    (useCapabilities as Mock).mockReturnValue({ data: undefined });
    const { result } = renderHook(() =>
      useCapabilitiesSafe({ chainId: mockChainId }),
    );
    expect(result.current).toEqual(walletCapabilitiesFalse);
  });

  it('should handle missing chain capabilities', () => {
    (useAccount as Mock).mockReturnValue({
      isConnected: true,
      connector: { id: 'some.other.wallet' },
    });
    (useCapabilities as Mock).mockReturnValue({ data: {} });
    const { result } = renderHook(() =>
      useCapabilitiesSafe({ chainId: mockChainId }),
    );
    expect(result.current).toEqual(walletCapabilitiesFalse);
  });

  it('should handle missing capabilities', () => {
    (useAccount as Mock).mockReturnValue({
      isConnected: true,
      connector: { id: 'some.other.wallet' },
    });
    (useCapabilities as Mock).mockReturnValue({
      data: {
        1: {},
      },
    });
    const { result } = renderHook(() =>
      useCapabilitiesSafe({ chainId: mockChainId }),
    );
    expect(result.current).toEqual(walletCapabilitiesFalse);
  });
});
