import { renderHook } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount, useSwitchChain } from 'wagmi';
import { useOnchainKit } from '@/useOnchainKit';
import { base, baseSepolia } from 'viem/chains';
import { useNetworkGuard } from './useNetworkGuard';

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  useSwitchChain: vi.fn(),
}));

vi.mock('@/useOnchainKit', () => ({
  useOnchainKit: vi.fn(),
}));

describe('useNetworkGuard', () => {
  const mockSwitchChainAsync = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return isWrongNetwork=false when not connected', () => {
    (useOnchainKit as Mock).mockReturnValue({ chain: base });
    (useAccount as Mock).mockReturnValue({ chainId: undefined, isConnected: false });
    (useSwitchChain as Mock).mockReturnValue({ switchChainAsync: mockSwitchChainAsync, isPending: false });

    const { result } = renderHook(() => useNetworkGuard());

    expect(result.current.isWrongNetwork).toBe(false);
    expect(result.current.targetChain).toBe(base);
  });

  it('should return isWrongNetwork=false when on correct chain', () => {
    (useOnchainKit as Mock).mockReturnValue({ chain: base });
    (useAccount as Mock).mockReturnValue({ chainId: base.id, isConnected: true });
    (useSwitchChain as Mock).mockReturnValue({ switchChainAsync: mockSwitchChainAsync, isPending: false });

    const { result } = renderHook(() => useNetworkGuard());

    expect(result.current.isWrongNetwork).toBe(false);
    expect(result.current.connectedChainId).toBe(base.id);
  });

  it('should return isWrongNetwork=true when on wrong chain', () => {
    (useOnchainKit as Mock).mockReturnValue({ chain: base });
    (useAccount as Mock).mockReturnValue({ chainId: 1, isConnected: true }); // Ethereum mainnet
    (useSwitchChain as Mock).mockReturnValue({ switchChainAsync: mockSwitchChainAsync, isPending: false });

    const { result } = renderHook(() => useNetworkGuard());

    expect(result.current.isWrongNetwork).toBe(true);
    expect(result.current.targetChain).toBe(base);
    expect(result.current.connectedChainId).toBe(1);
  });

  it('should call switchChainAsync with target chain id', async () => {
    (useOnchainKit as Mock).mockReturnValue({ chain: baseSepolia });
    (useAccount as Mock).mockReturnValue({ chainId: 1, isConnected: true });
    (useSwitchChain as Mock).mockReturnValue({ switchChainAsync: mockSwitchChainAsync, isPending: false });

    const { result } = renderHook(() => useNetworkGuard());

    await result.current.switchNetwork();

    expect(mockSwitchChainAsync).toHaveBeenCalledWith({ chainId: baseSepolia.id });
  });

  it('should not call switchChainAsync when on correct chain', async () => {
    (useOnchainKit as Mock).mockReturnValue({ chain: base });
    (useAccount as Mock).mockReturnValue({ chainId: base.id, isConnected: true });
    (useSwitchChain as Mock).mockReturnValue({ switchChainAsync: mockSwitchChainAsync, isPending: false });

    const { result } = renderHook(() => useNetworkGuard());

    await result.current.switchNetwork();

    expect(mockSwitchChainAsync).not.toHaveBeenCalled();
  });

  it('should expose isSwitching state', () => {
    (useOnchainKit as Mock).mockReturnValue({ chain: base });
    (useAccount as Mock).mockReturnValue({ chainId: 1, isConnected: true });
    (useSwitchChain as Mock).mockReturnValue({ switchChainAsync: mockSwitchChainAsync, isPending: true });

    const { result } = renderHook(() => useNetworkGuard());

    expect(result.current.isSwitching).toBe(true);
  });
});
