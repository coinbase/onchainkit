import { mainnet, optimism, sepolia } from 'viem/chains';
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
});
