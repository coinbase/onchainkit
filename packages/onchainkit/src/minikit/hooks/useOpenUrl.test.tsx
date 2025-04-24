import sdk from '@farcaster/frame-sdk';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { type Mock, afterEach, describe, expect, it, vi } from 'vitest';
import { useMiniKit } from './useMiniKit';
import { useOpenUrl } from './useOpenUrl';

vi.mock('@farcaster/frame-sdk', () => ({
  default: {
    actions: {
      openUrl: vi.fn(),
    },
  },
}));

vi.mock('./useMiniKit', () => ({
  useMiniKit: vi.fn().mockReturnValue({
    context: {},
  }),
}));

describe('useOpenUrl', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return a function', () => {
    const { result } = renderHook(() => useOpenUrl());
    expect(typeof result.current).toBe('function');
  });

  it('should call sdk.openUrl when executed', async () => {
    const { result } = renderHook(() => useOpenUrl());

    await act(async () => {
      result.current('https://example.com');
    });

    expect(sdk.actions.openUrl).toHaveBeenCalledWith('https://example.com');
  });

  it('should call window.open when context is not available', () => {
    const mockOpen = vi.fn();
    window.open = mockOpen;

    (useMiniKit as Mock).mockReturnValue({
      context: null,
    });

    const { result } = renderHook(() => useOpenUrl());

    result.current('https://example.com');

    expect(mockOpen).toHaveBeenCalledWith('https://example.com', '_blank');
  });
});
