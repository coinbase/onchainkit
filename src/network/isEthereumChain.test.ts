import { base, baseSepolia, mainnet, optimism, sepolia } from 'viem/chains';
import { isEthereumChain } from './isEthereumChain';

describe('isEthereumChain', () => {
  it('should return true for mainnet', () => {
    expect(isEthereumChain(mainnet.id)).toBeTruthy();
  });

  it('should return true for testnet', () => {
    expect(isEthereumChain(sepolia.id)).toBeTruthy();
  });

  it('should return false for other chains for testnet', () => {
    expect(isEthereumChain(optimism.id)).toBeFalsy();
  });
});
