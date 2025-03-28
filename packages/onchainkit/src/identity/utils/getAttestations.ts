import { getAttestationsByFilter } from '@/core/network/attestations';
import type { Attestation, GetAttestationsOptions } from '@/identity/types';
import type { Address, Chain } from 'viem';
import { isChainSupported } from './easSupportedChains';

/**
 * Fetches Ethereum Attestation Service (EAS) attestations for a given address and chain,
 * optionally filtered by schemas associated with the attestation.
 */
export async function getAttestations(
  address: Address,
  chain: Chain,
  options?: GetAttestationsOptions,
): Promise<Attestation[]> {
  if (!address) {
    console.log('Error in getAttestation: Address is not provided');
    return [];
  }

  if (!isChainSupported(chain)) {
    console.log('Error in getAttestation: Chain is not supported');
    return [];
  }
  try {
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
