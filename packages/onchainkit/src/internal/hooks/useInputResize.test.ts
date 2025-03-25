import { renderHook } from '@testing-library/react';
import type { RefObject } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useInputResize } from './useInputResize';

type MockResizeObserver = {
  observe: ReturnType<typeof vi.fn>;
  unobserve: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
};

describe('useInputResize', () => {
  let containerRef: RefObject<HTMLDivElement>;
  let wrapperRef: RefObject<HTMLDivElement>;
  let inputRef: RefObject<HTMLInputElement>;
  let measureRef: RefObject<HTMLSpanElement>;
  let labelRef: RefObject<HTMLSpanElement>;
  let resizeObserver: MockResizeObserver;
  let nullRef: RefObject<HTMLDivElement>;

  beforeEach(() => {
    // Create DOM elements with mocked dimensions
    const container = {
      clientWidth: 500,
    } as HTMLDivElement;

    const wrapper = {
      style: {} as CSSStyleDeclaration,
    } as HTMLDivElement;

    const input = {
      style: {} as CSSStyleDeclaration,
    } as HTMLInputElement;

    const measure = {
      clientWidth: 100,
      style: {} as CSSStyleDeclaration,
    } as HTMLSpanElement;

    const label = {
      clientWidth: 50,
    } as HTMLSpanElement;

    // Create refs
    containerRef = { current: container };
    wrapperRef = { current: wrapper };
    inputRef = { current: input };
    measureRef = { current: measure };
    labelRef = { current: label };
    nullRef = { current: null };

    // Mock ResizeObserver
    resizeObserver = {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    };

    // Mock window.ResizeObserver
    const MockResizeObserver = vi.fn(() => resizeObserver);
    vi.stubGlobal('ResizeObserver', MockResizeObserver);
  });

  it('should set up resize observer', () => {
    renderHook(() =>
      useInputResize(containerRef, wrapperRef, inputRef, measureRef, labelRef),
    );

    expect(resizeObserver.observe).toHaveBeenCalledWith(containerRef.current);
  });

  it('should clean up resize observer on unmount', () => {
    const { unmount } = renderHook(() =>
      useInputResize(containerRef, wrapperRef, inputRef, measureRef, labelRef),
    );

    unmount();
    expect(resizeObserver.disconnect).toHaveBeenCalled();
  });

  it('should set initial font size in rem units', () => {
    const { result } = renderHook(() =>
      useInputResize(containerRef, wrapperRef, inputRef, measureRef, labelRef),
    );

    result.current();

    expect(measureRef.current?.style.fontSize).toBe('3.75rem');
    expect(inputRef.current?.style.fontSize).toBe('3.75rem');
  });

  it('should scale down when content width exceeds available space', () => {
    // Mock measureRef clientWidth
    Object.defineProperty(measureRef.current, 'clientWidth', { value: 600 });

    const { result } = renderHook(() =>
      useInputResize(containerRef, wrapperRef, inputRef, measureRef, labelRef),
    );

    result.current();

    // Available width = container (500) - label (50) = 450
    // Scale = 450 / 600 = 0.75
    expect(wrapperRef.current?.style.transform).toBe('scale(0.75)');
    expect(wrapperRef.current?.style.transformOrigin).toBe('left center');
  });

  it('should not scale when content fits', () => {
    // Set small content width
    Object.defineProperty(measureRef.current, 'clientWidth', { value: 100 });

    const { result } = renderHook(() =>
      useInputResize(containerRef, wrapperRef, inputRef, measureRef, labelRef),
    );

    result.current();

    expect(wrapperRef.current?.style.transform).toBe('scale(1)');
  });

  it('should respect minimum scale', () => {
    // Set very large content width
    Object.defineProperty(measureRef.current, 'clientWidth', { value: 10000 });

    const { result } = renderHook(() =>
      useInputResize(containerRef, wrapperRef, inputRef, measureRef, labelRef, {
        minScale: 0.1,
      }),
    );

    result.current();

    expect(wrapperRef.current?.style.transform).toBe('scale(0.1)');
  });

  it('should allow custom base font size', () => {
    const { result } = renderHook(() =>
      useInputResize(containerRef, wrapperRef, inputRef, measureRef, labelRef, {
        baseFontSize: 2,
      }),
    );

    result.current();

    expect(measureRef.current?.style.fontSize).toBe('2rem');
    expect(inputRef.current?.style.fontSize).toBe('2rem');
  });

  it('should do nothing if any ref is null', () => {
    // Set one ref to null
    Object.defineProperty(measureRef.current, 'clientWidth', { value: 0 });

    const { result } = renderHook(() =>
      useInputResize(nullRef, wrapperRef, inputRef, measureRef, labelRef),
    );

    // Call the update function
    result.current();

    // Verify no styles were set

    expect(wrapperRef.current?.style.transform).toBe(undefined);
  });

  it('should not set up resize observer if container is null', () => {
    renderHook(() =>
      useInputResize(nullRef, wrapperRef, inputRef, measureRef, labelRef),
    );

    expect(resizeObserver.observe).not.toHaveBeenCalled();
  });
});
