import { describe, expect, it } from 'vitest';
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

  it('should return true when isMainnetOnly is true and chainId is mainnet', () => {
    const chainId = base.id;
    const isMainnetOnly = true;
    const result = isBase({ chainId, isMainnetOnly });
    expect(result).toEqual(true);
  });

  it('should return false when isMainnetOnly is true and chainId is not mainnet', () => {
    const chainId = baseSepolia.id;
    const isMainnetOnly = true;
    const result = isBase({ chainId, isMainnetOnly });
    expect(result).toEqual(false);
  });
});
