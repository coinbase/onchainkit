import { checkAddress } from './checkAddress';

describe('checkAddress', () => {
  it('should return true when address format is valid', () => {
    expect(checkAddress('0x1234', 4)).toEqual(true);
    expect(checkAddress('0x123456789ABCDEF1', 16)).toEqual(true);
    expect(checkAddress('0x123456789ABCDEF1123456789ABCDEF1', 32)).toEqual(true);
  });

  it('should return false when address for mat is invalid', () => {
    expect(checkAddress('1234', 4)).toEqual(false);
    expect(checkAddress('0x123456789ABC', 16)).toEqual(false);
    expect(checkAddress('0x123456789ABCDEF1123456789ABCDEF111', 32)).toEqual(false);
  });
});
