import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useOutsideClick } from './useOutsideClick';

describe('useOutsideClick', () => {
  it('should call callback when clicking outside element', () => {
    const callback = vi.fn();
    const elementRef = { current: document.createElement('div') };
    document.body.appendChild(elementRef.current);

    renderHook(() => useOutsideClick(elementRef, callback));

    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);
    outsideElement.click();

    expect(callback).toHaveBeenCalledTimes(1);

    document.body.removeChild(elementRef.current);
    document.body.removeChild(outsideElement);
  });

  it('should not call callback when clicking inside element', () => {
    const callback = vi.fn();
    const elementRef = { current: document.createElement('div') };
    document.body.appendChild(elementRef.current);

    renderHook(() => useOutsideClick(elementRef, callback));

    elementRef.current.click();

    expect(callback).not.toHaveBeenCalled();

    document.body.removeChild(elementRef.current);
  });

  it('should not call callback when ref is null', () => {
    const callback = vi.fn();
    const elementRef = { current: null };

    renderHook(() => useOutsideClick(elementRef, callback));

    document.body.click();

    expect(callback).not.toHaveBeenCalled();
  });

  it('should remove event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
    const callback = vi.fn();
    const elementRef = { current: document.createElement('div') };

    const { unmount } = renderHook(() => useOutsideClick(elementRef, callback));

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
      ({ cb }) => useOutsideClick(elementRef, cb),
      {
        initialProps: { cb: callback1 },
      },
    );

    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);
    outsideElement.click();

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).not.toHaveBeenCalled();

    rerender({ cb: callback2 });

    outsideElement.click();

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);

    document.body.removeChild(elementRef.current);
    document.body.removeChild(outsideElement);
  });
});
