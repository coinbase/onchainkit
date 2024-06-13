import { getAttestationsByFilter } from '../network/attestations';
import { isChainSupported, easSupportedChains } from './easSupportedChains';
import type { Attestation, GetAttestationsOptions } from './types';
import type { Address, Chain } from 'viem';

/**
 * Fetches Ethereum Attestation Service (EAS) attestations for a given address and chain,
 * optionally filtered by schemas associated with the attestation.
 *
 * @param {Address} address - The address for which attestations are being queried.
 * @param {Chain} chain - The blockchain of interest.
 * @param {GetAttestationsOptions} [options] - Optional filtering options.
 *   options.revoked - Filter for revoked attestations (default: false).
 *   options.expirationTime - Unix timestamp to filter attestations based on expiration time (default: current time).
 *   options.limit - The maximum number of attestations to return (default: 10).
 * @returns {Promise<Attestation[]>} A promise that resolves to an array of EAS Attestations.
 * @throws Will throw an error if the request to the GraphQL API fails.
 */
export async function getAttestations<TChain extends Chain>(
  address: Address,
  chain: TChain,
  options?: GetAttestationsOptions,
): Promise<Attestation[]> {
  try {
    if (!isChainSupported(chain)) {
      throw new Error(
        `Chain is not supported. Supported chains: ${Object.keys(easSupportedChains).join(', ')}`,
      );
    }

    // Default query filter values
    const defaultQueryVariablesFilter = {
      revoked: false,
      expirationTime: Math.round(Date.now() / 1000),
      limit: 10,
    };

    const queryVariablesFilter = { ...defaultQueryVariablesFilter, ...options };

    return await getAttestationsByFilter(address, chain, queryVariablesFilter);
  } catch (error) {
    console.log(`Error in getAttestation: ${(error as Error).message}`);
    return [];
  }
}
