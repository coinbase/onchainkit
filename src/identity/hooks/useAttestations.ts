import { useEffect, useState } from 'react';
import type { Address, Chain } from 'viem';

import { getEASAttestations } from '../getEASAttestations';
import { EASAttestation } from '../types';

type UseAttestations = {
  address: Address;
  chain: Chain | null;
  schemaId: Address | null;
};

export function useAttestations({
  address,
  chain,
  schemaId,
}: UseAttestations): EASAttestation[] | null {
  const [attestations, setAttestations] = useState<EASAttestation[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!address || !chain || !schemaId) {
        setAttestations(null);
        return;
      }
      const foundAttestations = await getEASAttestations(address, chain, {
        schemas: [schemaId],
      });
      setAttestations(foundAttestations);
    };
    fetchData();
  }, [address, chain, schemaId]);

  return attestations;
}
