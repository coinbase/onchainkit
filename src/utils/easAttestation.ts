import type { Chain } from 'viem';
import { EASSupportedChains, EASSchemaName, EASSupportedSchemas } from '../core/types';
import { easChainBase } from '../definitions/base'
import { easChainOptimism } from '../definitions/optimism'

export const easSupportedChains: EASSupportedChains = {
  [easChainBase.id]: easChainBase,
  [easChainOptimism.id]: easChainOptimism,
};

export const easAttestationSchemas: EASSupportedSchemas = {
  [easChainBase.id]: easChainBase.schemaUids,
  [easChainOptimism.id]: easChainOptimism.schemaUids,
};

// Function to check if a chain is supported in the application.
export function isChainSupported(chain: Chain): boolean {
  // Check if the chain's ID exists in the supportedChains object.
  return chain.id in easSupportedChains;
}

// Function to retrieve schema UIDs for a given chain and list of schemas.
export function getChainEASSchemasUids(
  schemas: EASSchemaName[],
  clientChainId?: number,
): `0x${string}`[] {
  // Return an empty array if the clientChainId is not provided or the chain is not supported.
  if (!clientChainId || !easSupportedChains[clientChainId]) {
    return [];
  }
  // Map each schema to its UID, filtering out any undefined values.
  return schemas.map((schema) => easSupportedChains[clientChainId].schemaUids[schema]).filter(Boolean);
}

// Function to get the list of attester addresses for a given chain.
export function getEASAttesterAddresses(chain: Chain): `0x${string}`[] {
  return easSupportedChains[chain.id]?.attesterAddresses ?? [];
}

// Function to get the EAS GraphQL API endpoint for a given chain.
export function getChainEASGraphQLAPI(chain: Chain): string {
  return easSupportedChains[chain.id]?.easGraphqlAPI ?? '';
}
