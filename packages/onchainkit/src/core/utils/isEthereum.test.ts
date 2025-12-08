import { mainnet, optimism, sepolia } from 'viem/chains';
import { describe, expect, it } from 'vitest';
import { isEthereum } from './isEthereum';
describe('isEthereum', () => {
  it('should return true for mainnet', () => {
    expect(isEthereum({ chainId: mainnet.id })).toBeTruthy();
  });

  it('should return true for testnet', () => {
    expect(isEthereum({ chainId: sepolia.id })).toBeTruthy();
  });

  it('should return false for other chains for testnet', () => {
    expect(isEthereum({ chainId: optimism.id })).toBeFalsy();
  });

  it('should return true when isMainnetOnly is true and chainId is mainnet', () => {
    expect(
      isEthereum({ chainId: mainnet.id, isMainnetOnly: true }),
    ).toBeTruthy();
  });

  it('should return false when isMainnetOnly is true and chainId is not mainnet', () => {
    expect(
      isEthereum({ chainId: sepolia.id, isMainnetOnly: true }),
    ).toBeFalsy();
  });
});
