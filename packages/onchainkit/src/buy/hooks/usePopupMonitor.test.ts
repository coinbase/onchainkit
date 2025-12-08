import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePopupMonitor } from './usePopupMonitor';

describe('usePopupMonitor', () => {
  let popupWindow: { closed: boolean };
  let onCloseMock: () => void;

  beforeEach(() => {
    popupWindow = {
      closed: false,
    };
    onCloseMock = vi.fn();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.resetAllMocks();
    vi.restoreAllMocks();
  });

  it('calls onClose when the popup is closed', () => {
    const { result } = renderHook(() => usePopupMonitor(onCloseMock));

    act(() => {
      result.current.startPopupMonitor(popupWindow as unknown as Window);
    });

    act(() => {
      popupWindow.closed = true;
      vi.advanceTimersByTime(500);
    });

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when the popup remains open', () => {
    const { result } = renderHook(() => usePopupMonitor(onCloseMock));

    act(() => {
      result.current.startPopupMonitor(popupWindow as unknown as Window);
    });

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(onCloseMock).not.toHaveBeenCalled();
  });

  it('cleans up interval when the component is unmounted', () => {
    const { result, unmount } = renderHook(() => usePopupMonitor(onCloseMock));

    act(() => {
      result.current.startPopupMonitor(popupWindow as unknown as Window);
    });

    act(() => {
      unmount();
    });

    expect(() => vi.runOnlyPendingTimers()).not.toThrow();
    expect(onCloseMock).not.toHaveBeenCalled();
  });

  it('stops monitoring the popup when stopPopupMonitor is called', () => {
    const { result } = renderHook(() => usePopupMonitor(onCloseMock));

    act(() => {
      result.current.startPopupMonitor(popupWindow as unknown as Window);
    });

    act(() => {
      result.current.stopPopupMonitor();
    });

    act(() => {
      popupWindow.closed = true;
      vi.advanceTimersByTime(500);
    });

    expect(onCloseMock).not.toHaveBeenCalled();
  });

  it('clears the previous interval before starting a new one', () => {
    const { result } = renderHook(() => usePopupMonitor(onCloseMock));

    // Start monitoring the first popup
    act(() => {
      result.current.startPopupMonitor(popupWindow as unknown as Window);
    });

    // Mock and spy on clearInterval
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

    // Start monitoring a second popup
    act(() => {
      result.current.startPopupMonitor(popupWindow as unknown as Window);
    });

    expect(clearIntervalSpy).toHaveBeenCalledTimes(1); // clearInterval should be called once

    clearIntervalSpy.mockRestore();
  });
});
