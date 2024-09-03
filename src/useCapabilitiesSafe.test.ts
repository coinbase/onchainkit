import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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
  const mockChain = {
    id: 1,
  };
  const walletCapabilitiesTrue = {
    paymasterServiceEnabled: true,
    atomicBatchEnabled: true,
    auxiliaryFundsEnabled: true,
  };
  const walletCapabilitiesFalse = {
    paymasterServiceEnabled: false,
    atomicBatchEnabled: false,
    auxiliaryFundsEnabled: false,
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return all capabilities as false when not connected', () => {
    (useAccount as vi.Mock).mockReturnValue({ isConnected: false });
    (useCapabilities as vi.Mock).mockReturnValue({ data: undefined });
    const { result } = renderHook(() =>
      useCapabilitiesSafe({ chain: mockChain }),
    );
    expect(result.current).toEqual(walletCapabilitiesFalse);
  });

  it('should return all capabilities as false for Metamask wallet', () => {
    (useAccount as vi.Mock).mockReturnValue({
      isConnected: true,
      connector: { id: 'io.metamask' },
    });
    (useCapabilities as vi.Mock).mockReturnValue({ data: undefined });
    const { result } = renderHook(() =>
      useCapabilitiesSafe({ chain: mockChain }),
    );
    expect(result.current).toEqual(walletCapabilitiesFalse);
  });

  it('should return correct capabilities when connected and not Metamask', () => {
    (useAccount as vi.Mock).mockReturnValue({
      isConnected: true,
      connector: { id: 'some.other.wallet' },
    });
    (useCapabilities as vi.Mock).mockReturnValue({
      data: {
        1: {
          atomicBatch: { supported: true },
          paymasterService: { supported: true },
          auxiliaryFunds: { supported: true },
        },
      },
    });
    const { result } = renderHook(() =>
      useCapabilitiesSafe({ chain: mockChain }),
    );
    expect(result.current).toEqual(walletCapabilitiesTrue);
  });

  it('should handle undefined capabilities', () => {
    (useAccount as vi.Mock).mockReturnValue({
      isConnected: true,
      connector: { id: 'some.other.wallet' },
    });
    (useCapabilities as vi.Mock).mockReturnValue({ data: undefined });
    const { result } = renderHook(() =>
      useCapabilitiesSafe({ chain: mockChain }),
    );
    expect(result.current).toEqual(walletCapabilitiesFalse);
  });

  it('should handle missing chain capabilities', () => {
    (useAccount as vi.Mock).mockReturnValue({
      isConnected: true,
      connector: { id: 'some.other.wallet' },
    });
    (useCapabilities as vi.Mock).mockReturnValue({ data: {} });
    const { result } = renderHook(() =>
      useCapabilitiesSafe({ chain: mockChain }),
    );
    expect(result.current).toEqual(walletCapabilitiesFalse);
  });
});
