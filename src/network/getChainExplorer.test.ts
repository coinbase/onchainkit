import { baseSepolia } from 'viem/chains';
import { describe, expect, it } from 'vitest';
import { getChainExplorer } from './getChainExplorer';

describe('getChainExplorer', () => {
  it('should return the correct chain explorer for baseSepolia', () => {
    expect(getChainExplorer(baseSepolia.id)).toBe(
      'https://sepolia.basescan.org',
    );
  });

  it('should return the default chain explorer for other chains', () => {
    expect(getChainExplorer(123)).toBe('https://basescan.org');
  });
});
