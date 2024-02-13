import { createEasGraphQLClient } from '../network/easGraphql';
import { easAttestationQuery, getEASAttestationQueryVariables } from '../queries/easAttestations';
import { isChainSupported, easSupportedChains } from '../utils/easAttestation';
import { EASAttestation, EASAttestationsQueryResponse, EASSchemaName } from './types';
import type { Address, Chain } from 'viem';

type GetEASAttestationsOptions = {
  schemas?: EASSchemaName[];
}

type GetEASAttestationsResponse = EASAttestation[];
/**
 * Fetches Ethereum Attestation Service (EAS) attestations for a given address and chain, 
 * optionally filtered by schemas associated with the attestation.
 * 
 * @param {Address} address - The address for which attestations are being queried.
 * @param {Chain} chain - The blockchain of interest.
 * @returns {Promise<GetEASAttestationsResponse[]>} A promise that resolves to an array of EAS Attestations.
 * @throws Will throw an error if the request to the GraphQL API fails.
 * 
 * @template TChain - A type extending Chain to ensure type safety for different blockchain implementations.
 */
export async function getEASAttestations<TChain extends Chain>(
  address: Address,
  chain: TChain,
  options?: GetEASAttestationsOptions,
): Promise<GetEASAttestationsResponse> {
  try {
    if (!isChainSupported(chain)) {
      throw new Error(`Chain is not supported. Supported chains: ${Object.keys(easSupportedChains).join(', ')}`);
    }
    
    const easGraphqlClient = createEasGraphQLClient(chain);
    const easAttestationQueryVariables = getEASAttestationQueryVariables(address, chain, filters);

    const { attestations } = await easGraphqlClient.request<EASAttestationsQueryResponse, typeof easAttestationQueryVariables>(easAttestationQuery, easAttestationQueryVariables);
  
    return attestations;
  } catch (error) {
    throw new Error(`Error in getEASAttestation: ${(error as Error).message}`);
  }
}
