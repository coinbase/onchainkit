'use client';

import type { ReactNode } from 'react';
import { useOnchainKit } from '../../useOnchainKit';
import { useAttestations } from '../hooks/useAttestations';
import { useIdentityContext } from '../context';

type DisplayBadgeReact = {
  children: ReactNode;
};

export function DisplayBadge({ children }: DisplayBadgeReact) {
  const { chain, schemaId } = useOnchainKit();
  const { schemaId: contextSchemaId, address } = useIdentityContext();
  if (!contextSchemaId && !schemaId) {
    throw new Error(
      'Name: a SchemaId must be provided to the Identity or Avatar component.',
    );
  }
  const attestations = useAttestations({
    address,
    chain: chain,
    schemaId: contextSchemaId ?? schemaId,
  });

  if (attestations.length === 0) {
    return null;
  }

  return children;
}
