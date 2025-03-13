import sdk from '@farcaster/frame-sdk';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useClose } from './useClose';

vi.mock('@farcaster/frame-sdk', () => ({
  default: {
    actions: {
      close: vi.fn(),
    },
  },
}));

describe('useClose', () => {
  it('should return a function', () => {
    const { result } = renderHook(() => useClose());
    expect(typeof result.current).toBe('function');
  });

  it('should call sdk.close when executed', async () => {
    const { result } = renderHook(() => useClose());

    await act(async () => {
      result.current();
    });

    expect(sdk.actions.close).toHaveBeenCalled();
  });
});
