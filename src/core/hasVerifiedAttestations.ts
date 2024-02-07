import type { Address } from 'viem';
import type { Chain } from 'viem';
import { getAttestation } from './getAttestation';
import { isChainSupported, getChainSchemasUids, AttestationSchema } from '../utils/attestation';

/**
 * Checks if the specified address has verified attestations for the given chain and expected schemas.
 *
 * @param chain - The blockchain to check for attestations.
 * @param address - The address to check for attestations.
 * @param expectedSchemas - An array of attestation schemas that are expected.
 * @returns A promise that resolves to a boolean indicating whether the address has the expected attestations.
 * @throws Will throw an error if the chain is not supported.
 */
export async function hasVerifiedAttestations<TChain extends Chain>(
  address: Address,
  chain: TChain,
  expectedSchemas: AttestationSchema[] = [],
): Promise<boolean> {
  if (!chain || !address || expectedSchemas.length === 0) {
    return false;
  }

  if (!isChainSupported(chain)) {
    throw new Error(`Chain ${chain.id} is not supported`);
  }

  const schemaUids = getChainSchemasUids(expectedSchemas, chain.id);
  const attestations = await getAttestation(address, chain, { schemas: expectedSchemas });
  const schemasFound = attestations.map((attestation) => attestation.schemaId);

  return schemaUids.every((schemaUid) => schemasFound.includes(schemaUid));
}
