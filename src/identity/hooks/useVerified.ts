import { useEffect, useState } from 'react';
import { base } from 'viem/chains';
import type { Address } from 'viem';

import { getEASAttestations } from '../getEASAttestations';
import { useIdentity } from './useIdentity';

export function useVerified(address: Address) {
  const [verified, setVerified] = useState(false);
  const identity = useIdentity();

  useEffect(() => {
    const fetchData = async () => {
      const attestation = await getEASAttestations(address, base);
      const found = attestation.find(({ schemaId }) => schemaId === identity.schemaId);

      if (found !== undefined) {
        setVerified(true);
      }
    };

    fetchData();
  }, [address]);

  return verified;
}
