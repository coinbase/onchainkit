import { describe, expect, it } from 'vitest';
import { getToastPosition } from './getToastPosition';

describe('getToastPosition', () => {
  it('should return "bottom-5 left-3/4" for "bottom-right" position', () => {
    const result = getToastPosition('bottom-right');
    expect(result).toBe('bottom-5 left-3/4');
  });

  it('should return "top-[100px] left-3/4" for "top-right" position', () => {
    const result = getToastPosition('top-right');
    expect(result).toBe('top-[100px] left-3/4');
  });

  it('should return "top-[100px] left-2/4" for "top-center" position', () => {
    const result = getToastPosition('top-center');
    expect(result).toBe('top-[100px] left-2/4');
  });

  it('should return "bottom-5 left-2/4" for any other position', () => {
    const result = getToastPosition('some-other-position');
    expect(result).toBe('bottom-5 left-2/4');
  });
});
