import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getBoundedPosition } from './getBoundedPosition';

describe('getBoundedPosition', () => {
  beforeEach(() => {
    vi.stubGlobal('window', { innerWidth: 1024, innerHeight: 768 });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('returns the position if the window is undefined', () => {
    vi.stubGlobal('window', undefined);
    const position = getBoundedPosition({
      draggableRef: { current: null },
      position: { x: 100, y: 100 },
    });
    expect(position).toEqual({ x: 100, y: 100 });
  });

  it('returns the position if the draggableRef is null', () => {
    const position = getBoundedPosition({
      draggableRef: { current: null },
      position: { x: 100, y: 100 },
    });
    expect(position).toEqual({ x: 100, y: 100 });
  });

  it('bounds position within viewport considering minGapToEdge', () => {
    const mockElement = {
      getBoundingClientRect: () => ({
        width: 100,
        height: 50,
      }),
    };

    const cases = [
      // Test left boundary
      {
        input: { x: -5, y: 100 },
        expected: { x: 10, y: 100 },
      },
      // Test right boundary
      {
        input: { x: 1000, y: 100 },
        expected: { x: 914, y: 100 }, // 1024 - 100 - 10
      },
      // Test top boundary
      {
        input: { x: 100, y: -5 },
        expected: { x: 100, y: 10 },
      },
      // Test bottom boundary
      {
        input: { x: 100, y: 800 },
        expected: { x: 100, y: 708 }, // 768 - 50 - 10
      },
    ];

    for (const { input, expected } of cases) {
      const position = getBoundedPosition({
        draggableRef: { current: mockElement as HTMLDivElement },
        position: input,
      });
      expect(position).toEqual(expected);
    }
  });

  it('respects custom minGapToEdge', () => {
    const mockElement = {
      getBoundingClientRect: () => ({
        width: 100,
        height: 50,
      }),
    };

    const position = getBoundedPosition({
      draggableRef: { current: mockElement as HTMLDivElement },
      position: { x: -10, y: -10 },
      minGapToEdge: 20,
    });

    expect(position).toEqual({ x: 20, y: 20 });
  });
});
