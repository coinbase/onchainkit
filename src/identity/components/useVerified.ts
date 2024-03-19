import { useEffect, useState } from 'react';
import { base } from 'viem/chains';
import type { Address } from 'viem';

import { getEASAttestations } from '../getEASAttestations';

export function useVerified(address: Address) {
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const attestation = await getEASAttestations(address, base);
      if (attestation.length > 0) {
        setVerified(true);
      }
    };

    fetchData();
  }, [address]);

  return verified;
}
