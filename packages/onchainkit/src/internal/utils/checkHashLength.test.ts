import { describe, expect, it } from 'vitest';
import { checkHashLength } from './checkHashLength';

describe('checkHashLength', () => {
  it('should return true when address format is valid', () => {
    expect(checkHashLength('0x1234', 4)).toEqual(true);
    expect(checkHashLength('0x123456789ABCDEF1', 16)).toEqual(true);
    expect(checkHashLength('0x123456789ABCDEF1123456789ABCDEF1', 32)).toEqual(
      true,
    );
  });

  it('should return false when address for mat is invalid', () => {
    expect(checkHashLength('1234', 4)).toEqual(false);
    expect(checkHashLength('0x123456789ABC', 16)).toEqual(false);
    expect(checkHashLength('0x123456789ABCDEF1123456789ABCDEF111', 32)).toEqual(
      false,
    );
  });
});
