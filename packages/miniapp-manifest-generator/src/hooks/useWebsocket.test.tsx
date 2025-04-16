import '@testing-library/jest-dom';
import { act } from 'react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { useWebsocket } from './useWebsocket';
import { renderHook } from '@testing-library/react';

const mockWebSocket = {
  send: vi.fn(),
  close: vi.fn(),
  onclose: null as (() => void) | null,
  onerror: null as ((err: Event) => void) | null,
};

const WebSocketMock = vi.fn(() => mockWebSocket);

vi.stubGlobal('WebSocket', WebSocketMock);

describe('useWebsocket', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
    vi.useRealTimers();
  });

  it('should initialize WebSocket connection', () => {
    renderHook(() => useWebsocket());

    expect(WebSocketMock).toHaveBeenCalledWith('ws://localhost:3333');
  });

  it('should reconnect on WebSocket close', () => {
    renderHook(() => useWebsocket());

    mockWebSocket.onclose?.();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(WebSocketMock).toHaveBeenCalledTimes(2);
  });

  it('should stop reconnecting after max attempts', () => {
    renderHook(() => useWebsocket());

    for (let i = 0; i < 6; i++) {
      mockWebSocket.onclose?.();

      act(() => {
        vi.advanceTimersByTime(1000);
      });
    }
    expect(WebSocketMock).toHaveBeenCalledTimes(6);
  });

  it('should handle WebSocket errors', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    renderHook(() => useWebsocket());

    mockWebSocket.onerror?.(new Event('error'));

    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('should cleanup WebSocket on unmount', () => {
    const mockClose = vi.fn();
    global.WebSocket = vi.fn().mockImplementation(() => ({
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      close: mockClose,
    })) as unknown as typeof WebSocket;

    const { unmount } = renderHook(() => useWebsocket());
    unmount();

    expect(mockClose).toHaveBeenCalled();
  });
});
