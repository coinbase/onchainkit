import { describe, expect, it } from 'vitest';
import { getAnimations } from './getAnimations';

describe('getAnimations', () => {
  it('returns closing animations when isSubComponentClosing is true and showSubComponentAbove is true', () => {
    const result = getAnimations(true, true);
    expect(result).toEqual({
      container:
        'fade-out slide-out-to-bottom-1.5 animate-out fill-mode-forwards ease-in-out',
      content: '',
    });
  });

  it('returns closing animations when isSubComponentClosing is true and showSubComponentAbove is false', () => {
    const result = getAnimations(true, false);
    expect(result).toEqual({
      container:
        'fade-out slide-out-to-top-1.5 animate-out fill-mode-forwards ease-in-out',
      content: '',
    });
  });

  it('returns opening animations when isSubComponentClosing is false and showSubComponentAbove is true', () => {
    const result = getAnimations(false, true);
    expect(result).toEqual({
      container:
        'fade-in slide-in-from-bottom-1.5 animate-in duration-300 ease-out',
      content:
        'fade-in slide-in-from-bottom-2.5 animate-in fill-mode-forwards duration-300 ease-out',
    });
  });

  it('returns opening animations when isSubComponentClosing is false and showSubComponentAbove is false', () => {
    const result = getAnimations(false, false);
    expect(result).toEqual({
      container:
        'fade-in slide-in-from-top-1.5 animate-in duration-300 ease-out',
      content:
        'fade-in slide-in-from-top-2.5 animate-in fill-mode-forwards duration-300 ease-out',
    });
  });
});
