import { useEffect, useState } from 'react';
import type { Address, Chain } from 'viem';
import { base } from 'viem/chains';

import { useOnchainKit } from '../../useOnchainKit';
import { getEASAttestations } from '../getEASAttestations';

export function useAttestation(address: Address) {
  const { identity } = useOnchainKit();
  const [attestation, setAttestation] = useState<'eas' | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (identity.eas !== undefined) {
        const attestation = await getEASAttestations(address, identity.eas.chain);

        const found = attestation.find(({ schemaId }) => schemaId === identity.eas.schemaId);

        if (found) {
          setAttestation('eas');
        }
      }
    };

    fetchData();
  }, [address, identity.eas]);

  return attestation;
}
