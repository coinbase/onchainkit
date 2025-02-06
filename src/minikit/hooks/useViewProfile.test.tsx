import sdk from '@farcaster/frame-sdk';
import { renderHook } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useMiniKit } from './useMiniKit';
import { useViewProfile } from './useViewProfile';

vi.mock('@farcaster/frame-sdk', () => ({
  default: {
    actions: {
      viewProfile: vi.fn(),
    },
  },
}));

vi.mock('./useMiniKit', () => ({
  useMiniKit: vi.fn(),
}));

describe('useViewProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useMiniKit as Mock).mockReturnValue({
      context: {
        user: {
          fid: 123,
        },
      },
    });
  });

  it('should return a function', () => {
    const { result } = renderHook(() => useViewProfile());
    expect(typeof result.current).toBe('function');
  });

  it('should call sdk.viewProfile with the default fid', async () => {
    const { result } = renderHook(() => useViewProfile());

    result.current();

    expect(sdk.actions.viewProfile).toHaveBeenCalledWith({ fid: 123 });
  });

  it('should call sdk.viewProfile with the provided fid', async () => {
    const { result } = renderHook(() => useViewProfile());

    result.current(456);

    expect(sdk.actions.viewProfile).toHaveBeenCalledWith({ fid: 456 });
  });

  it('should not call sdk.viewProfile if fid is not provided', async () => {
    (useMiniKit as Mock).mockReturnValue({
      context: null,
    });

    const { result } = renderHook(() => useViewProfile());

    result.current();

    expect(sdk.actions.viewProfile).not.toHaveBeenCalled();
  });
});
