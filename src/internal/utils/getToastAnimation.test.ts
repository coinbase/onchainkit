import { describe, expect, it } from 'vitest';
import { getToastAnimation } from './getToastAnimation';

describe('getToastAnimation', () => {
  it('should return animate-enterRight for top-right position', () => {
    const result = getToastAnimation('top-right');
    expect(result).toBe('animate-enterRight');
  });

  it('should return animate-enterDown for top-center position', () => {
    const result = getToastAnimation('top-center');
    expect(result).toBe('animate-enterDown');
  });

  it('should return animate-enterRight for bottom-right position', () => {
    const result = getToastAnimation('bottom-right');
    expect(result).toBe('animate-enterRight');
  });

  it('should return animate-enterUp for bottom-center position', () => {
    const result = getToastAnimation('bottom-center');
    expect(result).toBe('animate-enterUp');
  });

  it('should throw error for invalid position', () => {
    const position = 'invalid-position';
    // @ts-expect-error Testing invalid input
    expect(() => getToastAnimation(position)).toThrow('Invalid toast position');
  });
});
