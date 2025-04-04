import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useMiniKit } from './useMiniKit';
import { useNotification } from './useNotification';

vi.mock('./useMiniKit', () => ({
  useMiniKit: vi.fn(),
}));

describe('useNotification', () => {
  beforeEach(() => {
    (useMiniKit as Mock).mockReturnValue({
      context: {
        user: {
          fid: 123,
        },
      },
      notificationProxyUrl: '/api/notification',
    });
  });

  it('should return a function', () => {
    const { result } = renderHook(() => useNotification());
    expect(typeof result.current).toBe('function');
  });

  it('should return false if context is not set', async () => {
    (useMiniKit as Mock).mockReturnValue({
      context: null,
      notificationProxyUrl: '/api/notification',
    });

    const { result } = renderHook(() => useNotification());
    await expect(
      result.current({
        title: 'test',
        body: 'test',
      }),
    ).resolves.toBe(false);
  });

  it('should call notificationProxyUrl with the correct parameters', async () => {
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      }),
    );

    const { result } = renderHook(() => useNotification());

    const response = await act(async () => {
      return await result.current({
        title: 'test',
        body: 'test',
      });
    });

    expect(response).toBe(true);
    const calledBody = JSON.parse((global.fetch as Mock).mock.calls[0][1].body);
    expect(calledBody).toEqual({
      fid: 123,
      notification: {
        notificationId: expect.any(String),
        title: 'test',
        body: 'test',
        notificationDetails: null,
      },
    });
  });

  it('should allow notificationDetails to be passed in from context', async () => {
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      }),
    );

    (useMiniKit as Mock).mockReturnValue({
      context: {
        user: {
          fid: 123,
        },
        client: {
          notificationDetails: {
            token: '123',
            url: 'https://example.com',
          },
        },
      },
      notificationProxyUrl: '/api/notification',
    });

    const { result } = renderHook(() => useNotification());

    const response = await act(async () => {
      return await result.current({
        title: 'test',
        body: 'test',
      });
    });

    expect(response).toBe(true);
    const calledBody = JSON.parse((global.fetch as Mock).mock.calls[0][1].body);
    expect(calledBody).toEqual({
      fid: 123,
      notification: {
        notificationId: expect.any(String),
        title: 'test',
        body: 'test',
        notificationDetails: {
          token: '123',
          url: 'https://example.com',
        },
      },
    });
  });

  it('should return false when response is not ok', async () => {
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
      }),
    );

    const { result } = renderHook(() => useNotification());

    await expect(
      result.current({
        title: 'test',
        body: 'test',
      }),
    ).resolves.toBe(false);
  });

  it('should return false when fetch fails', async () => {
    // swallow error
    vi.spyOn(console, 'error').mockImplementation(vi.fn());

    global.fetch = vi
      .fn()
      .mockImplementation(() => Promise.reject(new Error('Network error')));

    const { result } = renderHook(() => useNotification());

    await expect(
      result.current({
        title: 'test',
        body: 'test',
      }),
    ).resolves.toBe(false);
  });
});
