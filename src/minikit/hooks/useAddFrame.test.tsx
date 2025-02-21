import { act } from 'react';
import { renderHook } from '@testing-library/react';
import { useAddFrame } from './useAddFrame';
import sdk from "@farcaster/frame-sdk";
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { useMiniKit } from './useMiniKit';

vi.mock('@farcaster/frame-sdk', () => ({
  default: {
    actions: {
      addFrame: vi.fn()
    },
  }
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
      updateClientContext: mockUpdateClientContext
    });
  })

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
});
