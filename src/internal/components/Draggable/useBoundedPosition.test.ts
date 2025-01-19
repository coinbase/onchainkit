import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useBoundedPosition } from './useBoundedPosition';

describe('useBoundedPosition', () => {
  const mockRef = { current: document.createElement('div') };
  const mockResetPosition = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1024);
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(768);
    mockRef.current = document.createElement('div');
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should debounce position updates', () => {
    const initialPosition = { x: 100, y: 100 };
    mockRef.current.getBoundingClientRect = vi.fn().mockReturnValue({
      width: 100,
      height: 100,
      top: 100,
      left: 100,
      right: 200,
      bottom: 200,
    });

    renderHook(() =>
      useBoundedPosition(mockRef, initialPosition, mockResetPosition),
    );

    // Position should not update immediately
    expect(mockResetPosition).not.toHaveBeenCalled();

    // Fast forward past debounce timeout
    vi.advanceTimersByTime(100);
    expect(mockResetPosition).not.toHaveBeenCalled();
  });

  it('should not reposition when element is within viewport', () => {
    const initialPosition = { x: 100, y: 100 };
    mockRef.current.getBoundingClientRect = vi.fn().mockReturnValue({
      width: 100,
      height: 100,
      top: 100,
      left: 100,
      right: 200,
      bottom: 200,
    });

    renderHook(() =>
      useBoundedPosition(mockRef, initialPosition, mockResetPosition),
    );

    window.dispatchEvent(new Event('resize'));
    expect(mockResetPosition).toHaveBeenCalledWith(initialPosition);
  });

  it('should not reposition when ref.current is falsey', () => {
    const initialPosition = { x: 100, y: 100 };
    // @ts-expect-error - we are testing the case where ref.current is falsey
    mockRef.current = null;

    renderHook(() =>
      useBoundedPosition(mockRef, initialPosition, mockResetPosition),
    );

    window.dispatchEvent(new Event('resize'));
    expect(mockResetPosition).not.toHaveBeenCalled();
  });

  it('should reposition when element is outside right viewport boundary', () => {
    mockRef.current.getBoundingClientRect = vi.fn().mockReturnValue({
      width: 100,
      height: 100,
      top: 100,
      left: 1000,
      right: 1100,
      bottom: 200,
    });

    renderHook(() =>
      useBoundedPosition(mockRef, { x: 1000, y: 100 }, mockResetPosition),
    );

    vi.advanceTimersByTime(100);
    expect(mockResetPosition).toHaveBeenCalledWith({ x: 914, y: 100 }); // 1024 - 100 - 10
  });

  it('should reposition when element is outside bottom viewport boundary', () => {
    mockRef.current.getBoundingClientRect = vi.fn().mockReturnValue({
      width: 100,
      height: 100,
      top: 700,
      left: 100,
      right: 200,
      bottom: 800,
    });

    renderHook(() =>
      useBoundedPosition(mockRef, { x: 100, y: 700 }, mockResetPosition),
    );

    window.dispatchEvent(new Event('resize'));
    expect(mockResetPosition).toHaveBeenCalledWith({ x: 100, y: 658 }); // 768 - 100 - 10
  });

  it('should reposition when element is outside left viewport boundary', () => {
    mockRef.current.getBoundingClientRect = vi.fn().mockReturnValue({
      width: 100,
      height: 100,
      top: 100,
      left: -100,
      right: 0,
      bottom: 200,
    });

    renderHook(() =>
      useBoundedPosition(mockRef, { x: -100, y: 100 }, mockResetPosition),
    );

    window.dispatchEvent(new Event('resize'));
    expect(mockResetPosition).toHaveBeenCalledWith({ x: 10, y: 100 }); // reset to 10
  });

  it('should reposition when element is outside top viewport boundary', () => {
    // Mock viewport size
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(800);
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(600);

    mockRef.current.getBoundingClientRect = vi.fn().mockReturnValue({
      width: 100,
      height: 100,
      top: -50,
      left: 100,
      right: 200,
      bottom: 50,
    });

    renderHook(() =>
      useBoundedPosition(mockRef, { x: 100, y: -50 }, mockResetPosition),
    );

    window.dispatchEvent(new Event('resize'));

    expect(mockResetPosition).toHaveBeenCalledWith({ x: 100, y: 10 }); // reset to 10
  });

  it('should not reposition when getBoundingClientRect returns null', () => {
    mockRef.current.getBoundingClientRect = vi.fn().mockReturnValue(null);

    renderHook(() =>
      useBoundedPosition(mockRef, { x: 100, y: 100 }, mockResetPosition),
    );

    window.dispatchEvent(new Event('resize'));
    vi.advanceTimersByTime(100);
    expect(mockResetPosition).not.toHaveBeenCalled();
  });
});
