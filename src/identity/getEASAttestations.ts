import { getEASAttestationsByFilter } from '../queries/easAttestations';
import { isChainSupported, easSupportedChains } from './easSupportedChains';
import { EASAttestation, GetEASAttestationsOptions } from './types';
import type { Address, Chain } from 'viem';

/**
 * Fetches Ethereum Attestation Service (EAS) attestations for a given address and chain,
 * optionally filtered by schemas associated with the attestation.
 *
 * @param {Address} address - The address for which attestations are being queried.
 * @param {Chain} chain - The blockchain of interest.
 * @param {GetEASAttestationsOptions} [options] - Optional filtering options.
 *   options.revoked - Filter for revoked attestations (default: false).
 *   options.expirationTime - Unix timestamp to filter attestations based on expiration time (default: current time).
 *   options.limit - The maximum number of attestations to return (default: 10).
 * @returns {Promise<EASAttestation[]>} A promise that resolves to an array of EAS Attestations.
 * @throws Will throw an error if the request to the GraphQL API fails.
 *
 * @example
import { getEASAttestations } from '@coinbase/onchainkit'
import { base } from "viem/chains";

const attestations = await getEASAttestations("0x1234567890abcdef1234567890abcdef12345678", base)
// [
//   {
//       "attester": "0x357458739F90461b99789350868CD7CF330Dd7EE",
//       "expirationTime": 0,
//       "id": "0x93016a60f13e7cfe0257116aedfce7088c2c0020787a325ea9f6b4ba11d07598",
//       "recipient": "0x44a7D120beA87455071cebB841eF91E6Ae21bC1a",
//       "revocationTime": 0,
//       "schemaId": "0x1801901fabd0e6189356b4fb52bb0ab855276d84f7ec140839fbd1f6801ca065",
//       "timeCreated": 1707269100,
//       "txid": "0x88448267566c9546ff31b9e6be229fb960f12bec8bc441259c7b064ae4159d34"
//   },
// ]
 */
export async function getEASAttestations<TChain extends Chain>(
  address: Address,
  chain: TChain,
  options?: GetEASAttestationsOptions,
): Promise<EASAttestation[]> {
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

    return await getEASAttestationsByFilter(address, chain, queryVariablesFilter);
  } catch (error) {
    console.log(`Error in getEASAttestation: ${(error as Error).message}`);
    return [];
  }
}
