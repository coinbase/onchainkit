import { base, baseSepolia } from 'viem/chains';
import type { IsBaseParams } from '../types';

/**
 * Checks if a given chain ID belongs to the Base network.
 *
 * This utility validates whether the provided chain ID corresponds to either
 * Base Mainnet or Base Sepolia testnet, with an option to restrict to mainnet only.
 *
 * @param params - The parameters for the check
 * @param params.chainId - The chain ID to validate
 * @param params.isMainnetOnly - When true, only Base Mainnet (8453) is considered valid.
 *                               When false (default), both Base Mainnet and Base Sepolia are valid.
 * @returns True if the chain ID belongs to the Base network based on the criteria, false otherwise
 *
 * @example
 * ```ts
 * // Check if chain is Base Mainnet or Sepolia
 * isBase({ chainId: 8453 }); // true (Base Mainnet)
 * isBase({ chainId: 84532 }); // true (Base Sepolia)
 * isBase({ chainId: 1 }); // false (Ethereum Mainnet)
 *
 * // Check if chain is Base Mainnet only
 * isBase({ chainId: 8453, isMainnetOnly: true }); // true
 * isBase({ chainId: 84532, isMainnetOnly: true }); // false
 * ```
 */
export function isBase({
  chainId,
  isMainnetOnly = false,
}: IsBaseParams): boolean {
  // If only Base mainnet
  if (isMainnetOnly && chainId === base.id) {
    return true;
  }
  // If only Base or Base Sepolia
  if (!isMainnetOnly && (chainId === baseSepolia.id || chainId === base.id)) {
    return true;
  }
  return false;
}

