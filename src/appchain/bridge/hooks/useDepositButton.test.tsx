import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount } from 'wagmi';
import type { BridgeableToken } from '../types';
import { useDepositButton } from './useDepositButton';
vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
}));

const mockToken = {
  name: 'USDC',
  address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  symbol: 'USDC',
  decimals: 6,
  image:
    'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
  chainId: 8453,
} as BridgeableToken;

describe('useDepositButton', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (useAccount as ReturnType<typeof vi.fn>).mockReturnValue({
      isConnected: true,
    });
  });

  it('should show spinner when deposit is pending', () => {
    const { result } = renderHook(() =>
      useDepositButton({
        depositStatus: 'depositPending',
        withdrawStatus: 'idle',
        bridgeParams: { amount: '1', amountUSD: '1', token: mockToken },
      }),
    );
    expect(result.current.isPending).toBe(true);
    expect(typeof result.current.buttonContent).toBe('object');
  });

  it('should show spinner when withdraw is pending', () => {
    const { result } = renderHook(() =>
      useDepositButton({
        depositStatus: 'idle',
        withdrawStatus: 'withdrawPending',
        bridgeParams: { amount: '1', amountUSD: '1', token: mockToken },
      }),
    );
    expect(result.current.isPending).toBe(true);
    expect(typeof result.current.buttonContent).toBe('object');
  });

  it('should show "Connect Wallet" when wallet is not connected', () => {
    (useAccount as ReturnType<typeof vi.fn>).mockReturnValue({
      isConnected: false,
    });

    const { result } = renderHook(() =>
      useDepositButton({
        depositStatus: 'idle',
        withdrawStatus: 'idle',
        bridgeParams: { amount: '1', amountUSD: '1', token: mockToken },
      }),
    );
    expect(result.current.buttonContent).toBe('Connect Wallet');
  });

  it('should show "Confirm" when wallet is connected and no pending actions', () => {
    const { result } = renderHook(() =>
      useDepositButton({
        depositStatus: 'idle',
        withdrawStatus: 'idle',
        bridgeParams: { amount: '1', amountUSD: '1', token: mockToken },
      }),
    );
    expect(result.current.buttonContent).toBe('Confirm');
  });

  it('should be disabled when amount is empty', () => {
    const { result } = renderHook(() =>
      useDepositButton({
        depositStatus: 'idle',
        withdrawStatus: 'idle',
        bridgeParams: { amount: '', amountUSD: '', token: mockToken },
      }),
    );
    expect(result.current.isDisabled).toBe(true);
  });

  it('should be disabled when amount is zero', () => {
    const { result } = renderHook(() =>
      useDepositButton({
        depositStatus: 'idle',
        withdrawStatus: 'idle',
        bridgeParams: { amount: '0', amountUSD: '0', token: mockToken },
      }),
    );
    expect(result.current.isDisabled).toBe(true);
  });

  it('should be disabled during pending operations', () => {
    const { result } = renderHook(() =>
      useDepositButton({
        depositStatus: 'depositPending',
        withdrawStatus: 'idle',
        bridgeParams: { amount: '1', amountUSD: '1', token: mockToken },
      }),
    );
    expect(result.current.isDisabled).toBe(true);
  });

  it('should track rejection status correctly', () => {
    const { result } = renderHook(() =>
      useDepositButton({
        depositStatus: 'depositRejected',
        withdrawStatus: 'idle',
        bridgeParams: { amount: '1', amountUSD: '1', token: mockToken },
      }),
    );
    expect(result.current.isRejected).toBe(true);
  });
});
