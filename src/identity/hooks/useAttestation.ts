import { useEffect, useState } from 'react';
import type { Address, Chain } from 'viem';

import { useOnchainKit } from '../../useOnchainKit';
import { getEASAttestations } from '../getEASAttestations';
import { EASAttestation } from '../types';

type UseAttestations = {
  address?: Address;
  chain?: Chain;
  schemaId?: Address;
};

export function useAttestations({
  address,
  chain,
  schemaId,
}: UseAttestations): EASAttestation[] | null {
  const onchainKitContext = useOnchainKit();
  let attestations: EASAttestation[] | null = null;
  let addressToUse = address ?? onchainKitContext?.address ?? null;
  let chainToUse = chain ?? onchainKitContext?.chain ?? null;
  let schemaIdToUse = schemaId ?? onchainKitContext?.schemaId ?? null;
  const [attestation, setAttestation] = useState<EASAttestation[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const foundAttestations = await getEASAttestations(addressToUse, chainToUse, {
        schemas: [schemaIdToUse],
      });
      setAttestation(foundAttestations);
    };
    fetchData();
  }, [addressToUse, chainToUse, schemaIdToUse]);

  return attestation;
}
