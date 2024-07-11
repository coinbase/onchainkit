import { getAttestationsByFilter } from '../network/attestations';
import { isChainSupported, easSupportedChains } from './easSupportedChains';
import type { Attestation, GetAttestationsOptions } from './types';
import type { Address, Chain } from 'viem';

/**
 * Fetches Ethereum Attestation Service (EAS) attestations for a given address and chain,
 * optionally filtered by schemas associated with the attestation.
 */
export async function getAttestations(
  address: Address,
  chain: Chain,
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
