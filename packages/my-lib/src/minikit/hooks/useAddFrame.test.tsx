import sdk from '@farcaster/frame-sdk';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAddFrame } from './useAddFrame';
import { useMiniKit } from './useMiniKit';

vi.mock('@farcaster/frame-sdk', () => ({
  default: {
    actions: {
      addFrame: vi.fn(),
    },
  },
}));

vi.mock('./useMiniKit', () => ({
  useMiniKit: vi.fn(),
}));

describe('useAddFrame', () => {
  let mockUpdateClientContext: Mock;
  beforeEach(() => {
    (sdk.actions.addFrame as Mock).mockResolvedValue({
      notificationDetails: {
        type: 'frame_added',
        frameId: '123',
      },
    });

    mockUpdateClientContext = vi.fn();
    (useMiniKit as Mock).mockReturnValue({
      updateClientContext: mockUpdateClientContext,
    });
  });

  it('should return a function', () => {
    const { result } = renderHook(() => useAddFrame());
    expect(typeof result.current).toBe('function');
  });

  it('should call sdk.addFrame when executed', async () => {
    const { result } = renderHook(() => useAddFrame());

    await act(async () => {
      await result.current();
    });

    expect(sdk.actions.addFrame).toHaveBeenCalled();
  });

  it('should call updateClientContext with the correct parameters', async () => {
    const { result } = renderHook(() => useAddFrame());

    await act(async () => {
      await result.current();
    });

    expect(mockUpdateClientContext).toHaveBeenCalledWith({
      details: {
        type: 'frame_added',
        frameId: '123',
      },
      frameAdded: true,
    });
  });

  it('should return null if notification details are not returned', async () => {
    (sdk.actions.addFrame as Mock).mockResolvedValue({});

    const { result } = renderHook(() => useAddFrame());

    const response = await result.current();

    expect(response).toBeNull();
  });
});
