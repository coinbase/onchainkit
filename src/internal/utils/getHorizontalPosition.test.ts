import { describe, expect, it } from 'vitest';
import { getHorizontalPosition } from './getHorizontalPosition';

describe('getHorizontalPosition', () => {
  const createMockRect = (
    left: number,
    right: number,
    width: number,
  ): DOMRect => ({
    left,
    right,
    width,
    top: 0,
    bottom: 0,
    height: 0,
    x: 0,
    y: 0,
    toJSON() {
      return this;
    },
  });

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

  it('should handle zero-width trigger', () => {
    const triggerRect = createMockRect(100, 100, 0);
    const contentRect = createMockRect(0, 0, 50);

    const position = getHorizontalPosition({
      align: 'center',
      contentRect,
      triggerRect,
    });

    expect(position).toBe(75);
  });

  it('should handle zero-width content', () => {
    const triggerRect = createMockRect(100, 200, 100);
    const contentRect = createMockRect(0, 0, 0);

    const position = getHorizontalPosition({
      align: 'center',
      contentRect,
      triggerRect,
    });

    expect(position).toBe(150);
  });

  it('should handle zero-width content with end alignment', () => {
    const triggerRect = createMockRect(100, 200, 100);
    const contentRect = createMockRect(0, 0, 0);

    const position = getHorizontalPosition({
      align: 'end',
      contentRect,
      triggerRect,
    });

    expect(position).toBe(200);
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

  it('should properly serialize DOMRect', () => {
    const mockRect = createMockRect(100, 200, 100);
    const serialized = mockRect.toJSON();

    expect(serialized).toEqual({
      left: 100,
      right: 200,
      width: 100,
      top: 0,
      bottom: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: serialized.toJSON,
    });
  });

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
