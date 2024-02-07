// Import necessary modules and types from 'viem/chains' and '../core/types'.
import { base, optimism } from 'viem/chains';
import type { Chain } from 'viem';

// Define an interface for the structure of each chain's data.
interface ChainData {
  easGraphqlAPI: string;
  schemaUids: Record<string, `0x${string}`>;
  attesterAddresses: `0x${string}`[];
}

// More details in https://github.com/coinbase/verifications
const baseChain: ChainData = {
  easGraphqlAPI: 'https://base.easscan.org/graphql',
  schemaUids: {
    VERIFIED_COUNTRY: '0x1801901fabd0e6189356b4fb52bb0ab855276d84f7ec140839fbd1f6801ca065',
    VERIFIED_ACCOUNT: '0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9',
  },
  attesterAddresses: ['0x357458739F90461b99789350868CD7CF330Dd7EE'],
};

// More details in https://docs.optimism.io/chain/identity/schemas
const optimismChain: ChainData = {
  easGraphqlAPI: 'https://optimism.easscan.org/graphql',
  schemaUids: {
    N_A: '0xac4c92fc5c7babed88f78a917cdbcdc1c496a8f4ab2d5b2ec29402736b2cf929',
    GITCOIN_PASSPORT_SCORES_V1:
      '0x6ab5d34260fca0cfcf0e76e96d439cace6aa7c3c019d7c4580ed52c6845e9c89',
    OPTIMISM_GOVERNANCE_SEASON_4_CO_GRANT_PARTICIPANT:
      '0x401a80196f3805c57b00482ae2b575a9f270562b6b6de7711af9837f08fa0faf',
  },
  attesterAddresses: [
    '0x38e9ef91f1a96aca71e2c5f7abfea45536b995a2',
    '0x2a0eb7cae52b68e94ff6ab0bfcf0df8eeeb624be',
    '0x2d93c2f74b2c4697f9ea85d0450148aa45d4d5a2',
    '0x843829986e895facd330486a61Ebee9E1f1adB1a',
    '0x3C7820f2874b665AC7471f84f5cbd6E12871F4cC',
  ],
};

const supportedChains: Record<number, ChainData> = {
  [base.id]: baseChain,
  [optimism.id]: optimismChain,
};

export const attestationSchemas = {
  [base.id]: baseChain.schemaUids,
  [optimism.id]: optimismChain.schemaUids,
};

export type AttestationSchema = keyof typeof baseChain.schemaUids &
  keyof typeof optimismChain.schemaUids;

// Function to check if a chain is supported in the application.
export function isChainSupported(chain: Chain): boolean {
  // Check if the chain's ID exists in the supportedChains object.
  return chain.id in supportedChains;
}

// Function to retrieve schema UIDs for a given chain and list of schemas.
export function getChainSchemasUids(
  schemas: AttestationSchema[],
  clientChainId?: number,
): `0x${string}`[] {
  // Return an empty array if the clientChainId is not provided or the chain is not supported.
  if (!clientChainId || !supportedChains[clientChainId]) {
    return [];
  }
  // Map each schema to its UID, filtering out any undefined values.
  return schemas.map((schema) => supportedChains[clientChainId].schemaUids[schema]).filter(Boolean);
}

// Function to get the list of attester addresses for a given chain.
export function getAttesterAddresses(chain: Chain): `0x${string}`[] {
  return supportedChains[chain.id]?.attesterAddresses ?? [];
}

// Function to get the EAS GraphQL API endpoint for a given chain.
export function getChainEASGraphQLAPI(chain: Chain): string {
  return supportedChains[chain.id]?.easGraphqlAPI ?? '';
}
