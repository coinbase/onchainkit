import type { Chain } from 'viem';
import type { EASChainDefinition } from '../types';
export type EASSupportedChains = Record<number, EASChainDefinition>;
export declare const easSupportedChains: EASSupportedChains;
/**
 * Checks if a given blockchain chain is supported by EAS attestations.
 */
export declare function isChainSupported(chain: Chain): boolean;
/**
 * Function to get the EAS GraphQL API endpoint for a given blockchain.
 */
export declare function getChainEASGraphQLAPI(chain: Chain): string;
//# sourceMappingURL=easSupportedChains.d.ts.map