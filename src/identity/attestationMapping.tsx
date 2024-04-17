import { ReactNode } from 'react';
import { Badge } from './components/Badge';
import { getEASAttestations } from './getEASAttestations';
import { Address, Chain } from 'viem';
import { base } from 'viem/chains';

type AttestationMethod = 'eas';

type AttestationMapping = Record<
  AttestationMethod,
  {
    Badge: ReactNode;
    predicate: ({
      address,
      chain,
      config,
    }: {
      address: Address;
      chain: Chain;
      config: unknown;
    }) => boolean;
  }
>;

export const attestationMapping = {
  eas: {
    Badge: Badge,
    predicate: async ({
      address,
      chain = base,
      config,
    }: {
      address: Address;
      chain: Chain;
      config: unknown;
    }) => {
      const attestation = await getEASAttestations(address, chain);
      const { schemaId: configSchemaId } = config as { schemaId: `0x${string}` };

      const found = attestation.find(({ schemaId }) => schemaId === configSchemaId);

      if (found !== undefined) {
        return true;
      }

      return false;
    },
  },
};
