import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useClickOutside } from './useClickOutside';

describe('useClickOutside', () => {
  it('should call callback when clicking outside element', () => {
    const callback = vi.fn();
    const elementRef = { current: document.createElement('div') };
    document.body.appendChild(elementRef.current);

    renderHook(() => useClickOutside(elementRef, callback));

    // Simulate click outside
    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);
    outsideElement.click();

    expect(callback).toHaveBeenCalledTimes(1);

    // Cleanup
    document.body.removeChild(elementRef.current);
    document.body.removeChild(outsideElement);
  });

  it('should not call callback when clicking inside element', () => {
    const callback = vi.fn();
    const elementRef = { current: document.createElement('div') };
    document.body.appendChild(elementRef.current);

    renderHook(() => useClickOutside(elementRef, callback));

    // Simulate click inside
    elementRef.current.click();

    expect(callback).not.toHaveBeenCalled();

    // Cleanup
    document.body.removeChild(elementRef.current);
  });

  it('should not call callback when ref is null', () => {
    const callback = vi.fn();
    const elementRef = { current: null };

    renderHook(() => useClickOutside(elementRef, callback));

    // Simulate click anywhere
    document.body.click();

    expect(callback).not.toHaveBeenCalled();
  });

  it('should remove event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
    const callback = vi.fn();
    const elementRef = { current: document.createElement('div') };

    const { unmount } = renderHook(() => useClickOutside(elementRef, callback));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'click',
      expect.any(Function),
      { capture: true },
    );

    removeEventListenerSpy.mockRestore();
  });

  it('should handle new callback references', () => {
    const elementRef = { current: document.createElement('div') };
    document.body.appendChild(elementRef.current);

    const callback1 = vi.fn();
    const callback2 = vi.fn();

    const { rerender } = renderHook(
      ({ cb }) => useClickOutside(elementRef, cb),
      {
        initialProps: { cb: callback1 },
      },
    );

    // Simulate click outside with first callback
    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);
    outsideElement.click();

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).not.toHaveBeenCalled();

    // Rerender with new callback
    rerender({ cb: callback2 });

    // Simulate another click outside
    outsideElement.click();

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);

    // Cleanup
    document.body.removeChild(elementRef.current);
    document.body.removeChild(outsideElement);
  });
});
