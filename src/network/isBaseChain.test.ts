import { base, baseSepolia, optimism } from 'viem/chains';
import { isBaseChain } from './isBaseChain';

describe('isBaseChain', () => {
  it('should return true for mainnet', () => {
    expect(isBaseChain(base.id)).toBeTruthy();
  });

  it('should return true for testnet', () => {
    expect(isBaseChain(baseSepolia.id)).toBeTruthy();
  });

  it('should return false for other chains for testnet', () => {
    expect(isBaseChain(optimism.id)).toBeFalsy();
  });
});
