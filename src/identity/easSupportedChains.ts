import type { Chain } from 'viem';
import type { EASChainDefinition } from './types';
import { easChainBase } from '../network/definitions/base';
import { easChainOptimism } from '../network/definitions/optimism';
import { easChainBaseSepolia } from '../network/definitions/baseSepolia';

export type EASSupportedChains = Record<number, EASChainDefinition>;

export const easSupportedChains: EASSupportedChains = {
  [easChainBase.id]: easChainBase,
  [easChainBaseSepolia.id]: easChainBaseSepolia,
  [easChainOptimism.id]: easChainOptimism,
};

/**
 * Checks if a given blockchain chain is supported by EAS attestations.
 */
export function isChainSupported(chain: Chain): boolean {
  return chain.id in easSupportedChains;
}

/**
 * Function to get the EAS GraphQL API endpoint for a given blockchain.
 */
export function getChainEASGraphQLAPI(chain: Chain): string {
  return easSupportedChains[chain.id]?.easGraphqlAPI ?? '';
}
