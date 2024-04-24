import { useEffect, useState } from 'react';
import type { Address, Chain } from 'viem';

import { getEASAttestations } from '../getEASAttestations';
import { EASAttestation } from '../types';

type UseAttestations = {
  address: Address;
  chain: Chain;
  schemaId: Address;
};

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
