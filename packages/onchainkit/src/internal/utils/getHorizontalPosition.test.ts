import { describe, expect, it } from 'vitest';
import { getHorizontalPosition } from './getHorizontalPosition';

describe('getHorizontalPosition', () => {
  const createMockRect = (left: number, right: number, width: number) =>
    ({
      left,
      right,
      width,
      top: 0,
      bottom: 0,
      height: 0,
      x: 0,
      y: 0,
    }) as DOMRect;

  it('should align content to start of trigger', () => {
    const triggerRect = createMockRect(100, 200, 100);
    const contentRect = createMockRect(0, 0, 50);

    const position = getHorizontalPosition({
      align: 'start',
      contentRect,
      triggerRect,
    });

    expect(position).toBe(100);
  });

  it('should center content relative to trigger', () => {
    const triggerRect = createMockRect(100, 200, 100);
    const contentRect = createMockRect(0, 0, 50);

    const position = getHorizontalPosition({
      align: 'center',
      contentRect,
      triggerRect,
    });

    expect(position).toBe(125);
  });

  it('should align content to end of trigger', () => {
    const triggerRect = createMockRect(100, 200, 100);
    const contentRect = createMockRect(0, 0, 50);

    const position = getHorizontalPosition({
      align: 'end',
      contentRect,
      triggerRect,
    });

    expect(position).toBe(150);
  });

  it('should handle content wider than trigger when centered', () => {
    const triggerRect = createMockRect(100, 200, 100);
    const contentRect = createMockRect(0, 0, 150);

    const position = getHorizontalPosition({
      align: 'center',
      contentRect,
      triggerRect,
    });

    expect(position).toBe(75);
  });

  const alignments = ['start', 'center', 'end'] as const;
  for (const align of alignments) {
    it(`should position correctly with align=${align}`, () => {
      const triggerRect = createMockRect(100, 200, 100);
      const contentRect = createMockRect(0, 0, 50);
      const viewportWidth = 1000;

      const position = getHorizontalPosition({
        align,
        contentRect,
        triggerRect,
      });

      expect(position).toBeGreaterThanOrEqual(0);
      expect(position).toBeLessThanOrEqual(viewportWidth - contentRect.width);
    });
  }

  it('should return 0 when triggerRect is undefined', () => {
    const contentRect = createMockRect(0, 0, 50);

    const position = getHorizontalPosition({
      align: 'start',
      contentRect,
      triggerRect: undefined,
    });

    expect(position).toBe(0);
  });

  it('should return 0 when contentRect is undefined', () => {
    const triggerRect = createMockRect(100, 200, 100);

    const position = getHorizontalPosition({
      align: 'start',
      contentRect: undefined,
      triggerRect,
    });

    expect(position).toBe(0);
  });
});
