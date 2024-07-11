import { mainnet, sepolia } from 'viem/chains';
import type { isEthereumOptions } from './types';

/**
 * isEthereum
 *  - Checks if the chain is mainnet or sepolia
 */
export function isEthereum({ chainId }: isEthereumOptions): boolean {
  if (chainId !== mainnet.id && chainId !== sepolia.id) {
    return false;
  }
  return true;
}
