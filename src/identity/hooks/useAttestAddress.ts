import { useEffect, useState } from 'react';
import { base } from 'viem/chains';
import type { Address, Chain } from 'viem';

import { getEASAttestations } from '../getEASAttestations';
import { useIdentity } from './useIdentity';

type UseVerified = {
  address: Address;
  chain?: Chain;
};

export function useAttestAddress({ address, chain = base }: UseVerified) {
  const [attested, setAttested] = useState(false);
  const identity = useIdentity();

  useEffect(() => {
    const fetchData = async () => {
      const attestation = await getEASAttestations(address, base);
      const found = attestation.find(({ schemaId }) => schemaId === identity.schemaId);

      if (found !== undefined) {
        setAttested(true);
      }
    };

    fetchData();
  }, [address]);

  return attested;
}
