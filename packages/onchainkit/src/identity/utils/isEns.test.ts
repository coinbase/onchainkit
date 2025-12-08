import { beforeEach, describe, expect, it, vi } from 'vitest';
import { isEns } from './isEns';

describe('isEns', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Returns true for mainnet names', async () => {
    expect(isEns('shrek.eth')).toBe(true);
    expect(isEns('shrek.optimism.eth')).toBe(true);
    expect(isEns('shrek.baaaaaes.eth')).toBe(true);
  });

  it('Returns true for mainnet sepolia names', async () => {
    expect(isEns('shrek.test.eth')).toBe(true);
  });

  it('Returns false for basenames', async () => {
    expect(isEns('shrek.base.eth')).toBe(false);
    expect(isEns('shrek.basetest.eth')).toBe(false);
  });

  it('Returns false for any other name', async () => {
    expect(isEns('shrek.optimism')).toBe(false);
    expect(isEns('shrek.baaaaaes')).toBe(false);
    expect(isEns('shrek')).toBe(false);
    expect(isEns('shrek.sol')).toBe(false);
  });
});
