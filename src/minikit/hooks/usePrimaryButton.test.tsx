import sdk from '@farcaster/frame-sdk';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { usePrimaryButton } from './usePrimaryButton';

vi.mock('@farcaster/frame-sdk', () => {
  const listeners: Record<string, (data: object) => void> = {};

  return {
    default: {
      actions: {
        setPrimaryButton: vi.fn(),
      },
      emit: vi.fn((event: string, data: object) => {
        if (listeners[event]) {
          listeners[event](data);
        }
      }),
      on: vi.fn((event, callback) => {
        listeners[event] = callback;
      }),
    },
  };
});

describe('usePrimaryButton', () => {
  it('should call sdk.actions.setPrimaryButton when executed', async () => {
    renderHook(() => usePrimaryButton({ text: 'test' }, () => {}));

    expect(sdk.actions.setPrimaryButton).toHaveBeenCalled();
  });

  it('should call callback on primaryButtonClicked event', async () => {
    const callback = vi.fn();
    renderHook(() => usePrimaryButton({ text: 'test' }, callback));

    act(() => {
      sdk.emit('primaryButtonClicked');
    });

    expect(callback).toHaveBeenCalled();
  });
});
