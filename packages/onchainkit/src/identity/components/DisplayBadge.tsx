import { useAttestations } from '@/identity/hooks/useAttestations';
import type { ReactNode } from 'react';
import type { Address } from 'viem';
import { useOnchainKit } from '../../onchainkit/hooks/useOnchainKit';
import { useIdentityContext } from './IdentityProvider';

type DisplayBadgeProps = {
  children: ReactNode;
  address?: Address;
};

export function DisplayBadge({ children, address }: DisplayBadgeProps) {
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
