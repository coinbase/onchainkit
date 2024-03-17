import type { Chain } from 'viem';
import { EASChainDefinition } from './types';
import { easChainBase } from '../definitions/base';
import { easChainOptimism } from '../definitions/optimism';
import { easChainBaseSepolia } from '../definitions/baseSepolia';

export type EASSupportedChains = Record<number, EASChainDefinition>;

export const easSupportedChains: EASSupportedChains = {
  [easChainBase.id]: easChainBase,
  [easChainBaseSepolia.id]: easChainBaseSepolia,
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

/**
 * Function to get the EAS GraphQL API endpoint for a given blockchain.
 *
 * @param {Chain} chain - The chain to be checked for support.
 * @returns {string} GraphQL endpoint
 */

export function getChainEASGraphQLAPI(chain: Chain): string {
  return easSupportedChains[chain.id]?.easGraphqlAPI ?? '';
}
