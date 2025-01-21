import type { ReactNode } from 'react';
import type { Address } from 'viem';
import { useAttestations } from '../../core-react/identity/hooks/useAttestations';
import { useIdentityContext } from './IdentityProvider';
import { useOnchainKit } from '../../core-react/useOnchainKit';

type DisplayBadgeReact = {
  children: ReactNode;
  address?: Address;
};

export function DisplayBadge({ children, address }: DisplayBadgeReact) {
  const { chain, schemaId } = useOnchainKit();
  const { schemaId: contextSchemaId, address: contextAddress } =
    useIdentityContext();
  if (!contextSchemaId && !schemaId) {
    throw new Error(
      'Name: a SchemaId must be provided to the OnchainKitProvider or Identity component.',
    );
  }
  const attestations = useAttestations({
    address: address ?? contextAddress,
    chain: chain,
    schemaId: contextSchemaId ?? schemaId,
  });

  if (attestations.length === 0) {
    return null;
  }

  return children;
}
