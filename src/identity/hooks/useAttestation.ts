import { useEffect, useState } from 'react';
import type { Address, Chain } from 'viem';
import { base } from 'viem/chains';

import { useOnchainKit } from '../../useOnchainKit';
import { getEASAttestations } from '../getEASAttestations';
import { attestationMapping } from '../attestationMapping';

export function useAttestation(address: Address) {
  const { identity } = useOnchainKit();
  const [attestation, setAttestation] = useState<'eas' | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (identity.eas !== undefined) {
        const { predicate } = attestationMapping.eas;

        const result = await predicate({
          address,
          chain: identity.eas.chain,
          config: identity.eas,
        });

        if (result) {
          setAttestation('eas');
        }
      }
    };

    fetchData();
  }, [address, identity.eas]);

  return attestation;
}
