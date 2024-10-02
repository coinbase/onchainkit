import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { describe, expect, it } from 'vitest';
import type { LifecycleStatus } from '../types';
import { useLifecycleStatus } from './useLifecycleStatus';

const initialLifecycleStatus = {
  statusName: 'init',
  statusData: null,
} as LifecycleStatus;

describe('useLifecycleStatus', () => {
  it('should initialize correctly', () => {
    const { result } = renderHook(() =>
      useLifecycleStatus(initialLifecycleStatus),
    );

    const [lifecycleStatus] = result.current;
    expect(lifecycleStatus).toEqual(initialLifecycleStatus);
  });

  it('should persist statusData for the full lifecycle', async () => {
    const { result } = renderHook(() =>
      useLifecycleStatus(initialLifecycleStatus),
    );

    const [initialStatus, updateLifecycleStatus] = result.current;

    expect(initialStatus).toEqual(initialLifecycleStatus);

    await act(async () => {
      updateLifecycleStatus({
        statusName: 'mediaLoading',
        statusData: {
          mimeType: 'image/png',
          mediaUrl: 'https://example.com/image.png',
        },
      });
    });

    await act(async () => {
      updateLifecycleStatus({
        statusName: 'mediaLoaded',
      });
    });

    const [updatedStatus] = result.current;

    expect(updatedStatus).toEqual({
      statusName: 'mediaLoaded',
      statusData: {
        mimeType: 'image/png',
        mediaUrl: 'https://example.com/image.png',
      },
    });
  });

  it('should not persist errors', async () => {
    const { result } = renderHook(() =>
      useLifecycleStatus(initialLifecycleStatus),
    );

    const [initialStatus, updateLifecycleStatus] = result.current;

    expect(initialStatus).toEqual(initialLifecycleStatus);

    await act(async () => {
      updateLifecycleStatus({
        statusName: 'error',
        statusData: {
          error: 'error',
          code: 'error code',
          message: 'error message',
        },
      });
    });

    let [updatedStatus] = result.current;

    expect(updatedStatus).toEqual({
      statusName: 'error',
      statusData: {
        error: 'error',
        code: 'error code',
        message: 'error message',
      },
    });

    await act(async () => {
      updateLifecycleStatus({
        statusName: 'mediaLoaded',
      });
    });

    [updatedStatus] = result.current;

    expect(updatedStatus).toEqual({
      statusName: 'mediaLoaded',
      statusData: {},
    });
  });

  it('should overwrite passed in statusData', async () => {
    const { result } = renderHook(() =>
      useLifecycleStatus(initialLifecycleStatus),
    );

    const [, updateLifecycleStatus] = result.current;

    await act(async () => {
      updateLifecycleStatus({
        statusName: 'mediaLoading',
        statusData: {
          mimeType: 'image/png',
          mediaUrl: 'https://example.com/image.png',
        },
      });
    });

    const [updatedStatus] = result.current;

    expect(updatedStatus).toEqual({
      statusName: 'mediaLoading',
      statusData: {
        mimeType: 'image/png',
        mediaUrl: 'https://example.com/image.png',
      },
    });
  });
});
