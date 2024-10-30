import { useEffect, useState } from 'react';
import type { Attestation, UseAttestations } from '../types';
import { getAttestations } from '../utils/getAttestations';

/**
 * Fetches EAS Attestations for a given address, chain, and schemaId.
 */
export function useAttestations({
  address,
  chain,
  schemaId,
}: UseAttestations): Attestation[] {
  if (!schemaId) {
    return [];
  }
  const [attestations, setAttestations] = useState<Attestation[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const foundAttestations = await getAttestations(address, chain, {
        schemas: [schemaId],
      });
      setAttestations(foundAttestations);
    };
    fetchData();
  }, [address, chain, schemaId]);

  return attestations;
}
