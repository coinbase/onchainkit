import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useRespositionOnWindowResize } from './useRepositionOnResize';

describe('useRespositionOnWindowResize', () => {
  const mockRef = { current: document.createElement('div') };
  const mockResetPosition = vi.fn();

  beforeEach(() => {
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1024);
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(768);
    mockRef.current = document.createElement('div');

    vi.clearAllMocks();
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
      useRespositionOnWindowResize(mockRef, initialPosition, mockResetPosition),
    );

    window.dispatchEvent(new Event('resize'));

    // Get the callback function that was passed to resetPosition
    const callback = mockResetPosition.mock.calls[0][0];
    // Call the callback with current position and verify it returns same position
    expect(callback(initialPosition)).toEqual(initialPosition);
  });

  it('should not reposition when ref.current is falsey', () => {
    const initialPosition = { x: 100, y: 100 };
    // @ts-expect-error - we are testing the case where ref.current is falsey
    mockRef.current = null;

    renderHook(() =>
      useRespositionOnWindowResize(mockRef, initialPosition, mockResetPosition),
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
      useRespositionOnWindowResize(
        mockRef,
        { x: 1000, y: 100 },
        mockResetPosition,
      ),
    );

    window.dispatchEvent(new Event('resize'));
    const callback = mockResetPosition.mock.calls[0][0];
    const newPosition = callback({ x: 1000, y: 100 });
    expect(newPosition.x).toBe(914); // 1024 - 100 - 10
    expect(newPosition.y).toBe(100); // y shouldn't change
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
      useRespositionOnWindowResize(
        mockRef,
        { x: 100, y: 700 },
        mockResetPosition,
      ),
    );

    window.dispatchEvent(new Event('resize'));
    const callback = mockResetPosition.mock.calls[0][0];
    const newPosition = callback({ x: 100, y: 700 });
    expect(newPosition.x).toBe(100); // x shouldn't change
    expect(newPosition.y).toBe(658); // 768 - 100 - 10
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
      useRespositionOnWindowResize(
        mockRef,
        { x: -100, y: 100 },
        mockResetPosition,
      ),
    );

    window.dispatchEvent(new Event('resize'));
    const callback = mockResetPosition.mock.calls[0][0];
    const newPosition = callback({ x: -100, y: 100 });
    expect(newPosition.x).toBe(10); // reset to 10
    expect(newPosition.y).toBe(100); // y shouldn't change
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
      useRespositionOnWindowResize(
        mockRef,
        { x: 100, y: -50 },
        mockResetPosition,
      ),
    );

    window.dispatchEvent(new Event('resize'));

    const callback = mockResetPosition.mock.calls[0][0];
    const newPosition = callback({ x: 100, y: -50 });
    expect(newPosition.x).toBe(100); // x shouldn't change
    expect(newPosition.y).toBe(10); // reset to 10
  });
});
