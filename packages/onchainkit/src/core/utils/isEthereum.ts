import { mainnet, sepolia } from 'viem/chains';
import type { IsEthereumParams } from '../types';

/**
 * Checks if a given chain ID belongs to the Ethereum network.
 *
 * This utility validates whether the provided chain ID corresponds to either
 * Ethereum Mainnet or Sepolia testnet, with an option to restrict to mainnet only.
 *
 * @param params - The parameters for the check
 * @param params.chainId - The chain ID to validate
 * @param params.isMainnetOnly - When true, only Ethereum Mainnet (1) is considered valid.
 *                               When false (default), both Ethereum Mainnet and Sepolia are valid.
 * @returns True if the chain ID belongs to the Ethereum network based on the criteria, false otherwise
 *
 * @example
 * ```ts
 * // Check if chain is Ethereum Mainnet or Sepolia
 * isEthereum({ chainId: 1 }); // true (Ethereum Mainnet)
 * isEthereum({ chainId: 11155111 }); // true (Sepolia)
 * isEthereum({ chainId: 8453 }); // false (Base)
 *
 * // Check if chain is Ethereum Mainnet only
 * isEthereum({ chainId: 1, isMainnetOnly: true }); // true
 * isEthereum({ chainId: 11155111, isMainnetOnly: true }); // false
 * ```
 */
export function isEthereum({
  chainId,
  isMainnetOnly = false,
}: IsEthereumParams): boolean {
  // If only ETH mainnet
  if (isMainnetOnly && chainId === mainnet.id) {
    return true;
  }
  // If only ETH or ETH Sepolia
  if (!isMainnetOnly && (chainId === sepolia.id || chainId === mainnet.id)) {
    return true;
  }
  return false;
}

