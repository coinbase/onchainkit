import { isBase } from './isBase';

const baseSepolia = { id: 84532 };
const base = { id: 8453 };

describe('isBase', () => {
  it('should return false if the chainId is not baseSepolia.id or base.id', () => {
    const chainId = 999;
    const result = isBase({ chainId });
    expect(result).toEqual(false);
  });

  it('should return true if the chainId is baseSepolia.id', () => {
    const chainId = baseSepolia.id;
    const result = isBase({ chainId });
    expect(result).toEqual(true);
  });

  it('should return true if the chainId is base.id', () => {
    const chainId = base.id;
    const result = isBase({ chainId });
    expect(result).toEqual(true);
  });
});
