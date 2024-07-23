import { describe, expect, it } from 'vitest';
/**
 * @vitest-environment node
 */
import { getTokenImageColor } from './getTokenImageColor';

describe('getTokenImageColor', () => {
  it('should return a consistent color for the same string', () => {
    const str = 'test';
    const color1 = getTokenImageColor(str);
    const color2 = getTokenImageColor(str);
    expect(color1).toBe(color2);
  });

  it('should return different colors for different strings', () => {
    const color1 = getTokenImageColor('test1');
    const color2 = getTokenImageColor('test2');
    expect(color1).not.toBe(color2);
  });
});
