import type { Chain } from 'viem';
import { EASChainDefinition } from '../core/types';
import { easChainBase } from '../definitions/base'
import { easChainOptimism } from '../definitions/optimism'

export type EASSupportedChains = Record<number, EASChainDefinition>;

export const easSupportedChains: EASSupportedChains = {
  [easChainBase.id]: easChainBase,
  [easChainOptimism.id]: easChainOptimism,
};

/**
 * Checks if a given blockchain chain is supported by EAS attestations.
 * 
 * @param {Chain} chain - The chain to be checked for support.
 * @returns {boolean} True if the chain is supported, false otherwise.
 */
export function isChainSupported(chain: Chain): boolean {
  return chain.id in easSupportedChains;
}
