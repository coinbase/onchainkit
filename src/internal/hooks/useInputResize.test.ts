import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useInputResize } from './useInputResize';

describe('useInputResize', () => {
  let resizeCallback: (entries: ResizeObserverEntry[]) => void;

  beforeEach(() => {
    // Mock ResizeObserver with callback capture
    global.ResizeObserver = vi.fn().mockImplementation((callback) => {
      resizeCallback = callback;
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      };
    });
  });

  it('handles null refs', () => {
    const containerRef = { current: null };
    const inputRef = { current: null };
    const hiddenSpanRef = { current: null };
    const currencySpanRef = { current: null };

    const { result } = renderHook(() =>
      useInputResize(containerRef, inputRef, hiddenSpanRef, currencySpanRef),
    );

    expect(() => result.current()).not.toThrow();
  });

  it('updates input width based on measurements', () => {
    const containerRef = {
      current: {
        getBoundingClientRect: () => ({ width: 300 }),
      },
    };
    const inputRef = {
      current: {
        style: {},
      },
    };
    const hiddenSpanRef = {
      current: {
        offsetWidth: 100,
      },
    };
    const currencySpanRef = {
      current: {
        getBoundingClientRect: () => ({ width: 20 }),
      },
    };
    const { result } = renderHook(() =>
      useInputResize(
        containerRef as React.RefObject<HTMLDivElement>,
        inputRef as React.RefObject<HTMLInputElement>,
        hiddenSpanRef as React.RefObject<HTMLSpanElement>,
        currencySpanRef as React.RefObject<HTMLSpanElement>,
      ),
    );

    result.current();

    expect((inputRef.current as HTMLInputElement).style.width).toBe('100px');
    expect((inputRef.current as HTMLInputElement).style.maxWidth).toBe('280px');
  });

  it('calls updateInputWidth when ResizeObserver triggers', () => {
    const containerRef = {
      current: {
        getBoundingClientRect: () => ({ width: 300 }),
      },
    };
    const inputRef = {
      current: {
        style: {},
      },
    };
    const hiddenSpanRef = {
      current: {
        offsetWidth: 100,
      },
    };
    const currencySpanRef = {
      current: {
        getBoundingClientRect: () => ({ width: 20 }),
      },
    };

    renderHook(() =>
      useInputResize(
        containerRef as React.RefObject<HTMLDivElement>,
        inputRef as React.RefObject<HTMLInputElement>,
        hiddenSpanRef as React.RefObject<HTMLSpanElement>,
        currencySpanRef as React.RefObject<HTMLSpanElement>,
      ),
    );

    // Trigger the ResizeObserver callback
    resizeCallback([
      {
        contentRect: { width: 300 } as DOMRectReadOnly,
        target: document.createElement('div'),
        borderBoxSize: [],
        contentBoxSize: [],
        devicePixelContentBoxSize: [],
      },
    ]);

    // Verify the input width was updated
    expect((inputRef.current as HTMLInputElement).style.width).toBe('100px');
    expect((inputRef.current as HTMLInputElement).style.maxWidth).toBe('280px');
  });

  it('handles missing currency ref but present other refs', () => {
    const containerRef = {
      current: {
        getBoundingClientRect: () => ({ width: 300 }),
      },
    };
    const inputRef = {
      current: {
        style: {},
      },
    };
    const hiddenSpanRef = {
      current: {
        offsetWidth: 100,
      },
    };
    const currencySpanRef = { current: null };

    const { result } = renderHook(() =>
      useInputResize(
        containerRef as React.RefObject<HTMLDivElement>,
        inputRef as React.RefObject<HTMLInputElement>,
        hiddenSpanRef as React.RefObject<HTMLSpanElement>,
        currencySpanRef as React.RefObject<HTMLSpanElement>,
      ),
    );

    result.current();

    // Should still work but with 0 currency width
    expect((inputRef.current as HTMLInputElement).style.width).toBe('100px');
    expect((inputRef.current as HTMLInputElement).style.maxWidth).toBe('300px'); // full container width since currency width is 0
  });
});
