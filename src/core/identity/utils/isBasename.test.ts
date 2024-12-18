import { beforeEach, describe, expect, it, vi } from 'vitest';
import { isBasename } from './isBasename';

describe('isBasename', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Returns true for base mainnet names', async () => {
    expect(isBasename('shrek.base.eth')).toBe(true);
  });

  it('Returns true for base mainnet sepolia names', async () => {
    expect(isBasename('shrek.basetest.eth')).toBe(true);
  });

  it('Returns false for any other name', async () => {
    expect(isBasename('shrek.optimisim.eth')).toBe(false);
    expect(isBasename('shrek.eth')).toBe(false);
    expect(isBasename('shrek.baaaaaes.eth')).toBe(false);
  });
});
