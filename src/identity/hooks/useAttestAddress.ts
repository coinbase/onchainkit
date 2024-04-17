import { useEffect, useState } from 'react';
import { base } from 'viem/chains';
import type { Address, Chain } from 'viem';

import { getEASAttestations } from '../getEASAttestations';
import { useIdentity } from './useIdentity';
import { attestationMapping } from '../attestationMapping';

type UseAttestAddress = {
  address: Address;
  chain?: Chain;
};

export function useAttestAddress({ address, chain = base }: UseAttestAddress) {
  const [attested, setAttested] = useState<'eas' | null>(null);
  const identity = useIdentity();

  useEffect(() => {
    const fetchData = async () => {
      if (identity.eas !== undefined) {
        const { predicate } = attestationMapping.eas;

        const result = await predicate({ address, chain, config: identity.eas });

        if (result) {
          setAttested('eas');
        }
      }
    };

    fetchData();
  }, [address, chain, identity.eas]);

  return attested;
}
