import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCapabilitiesSafe } from './useCapabilitiesSafe';
import { useAccount } from 'wagmi';
import { useCapabilities } from 'wagmi/experimental';

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

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return all capabilities as false when not connected', () => {
    (useAccount as vi.Mock).mockReturnValue({ isConnected: false });
    const { result } = renderHook(() =>
      useCapabilitiesSafe({ chain: mockChain })
    );
    expect(result.current).toEqual({
      paymaster: false,
      batching: false,
      funding: false,
    });
  });

  it('should return all capabilities as false for Metamask wallet', () => {
    (useAccount as vi.Mock).mockReturnValue({
      isConnected: true,
      connector: { id: 'io.metamask' },
    });
    const { result } = renderHook(() =>
      useCapabilitiesSafe({ chain: mockChain })
    );
    expect(result.current).toEqual({
      paymaster: false,
      batching: false,
      funding: false,
    });
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
          auxiliaryFunds: { supported: false },
        },
      },
    });
    const { result } = renderHook(() =>
      useCapabilitiesSafe({ chain: mockChain })
    );
    expect(result.current).toEqual({
      paymaster: true,
      batching: true,
      funding: false,
    });
  });

  it('should handle undefined capabilities', () => {
    (useAccount as vi.Mock).mockReturnValue({
      isConnected: true,
      connector: { id: 'some.other.wallet' },
    });
    (useCapabilities as vi.Mock).mockReturnValue({ data: undefined });
    const { result } = renderHook(() =>
      useCapabilitiesSafe({ chain: mockChain })
    );
    expect(result.current).toEqual({
      paymaster: false,
      batching: false,
      funding: false,
    });
  });

  it('should handle missing chain capabilities', () => {
    (useAccount as vi.Mock).mockReturnValue({
      isConnected: true,
      connector: { id: 'some.other.wallet' },
    });
    (useCapabilities as vi.Mock).mockReturnValue({ data: {} });
    const { result } = renderHook(() =>
      useCapabilitiesSafe({ chain: mockChain })
    );
    expect(result.current).toEqual({
      paymaster: false,
      batching: false,
      funding: false,
    });
  });
});
