import { useEffect, useState } from 'react';
import { getEASAttestations } from '../getEASAttestations';
import { EASAttestation, UseAttestations } from '../types';

/**
 * Fetches EAS Attestations for a given address, chain, and schemaId.
 */
export function useAttestations({ address, chain, schemaId }: UseAttestations): EASAttestation[] {
  const [attestations, setAttestations] = useState<EASAttestation[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const foundAttestations = await getEASAttestations(address, chain, {
        schemas: [schemaId],
      });
      setAttestations(foundAttestations);
    };
    fetchData();
  }, [address, chain, schemaId]);

  return attestations;
}
