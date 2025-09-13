import { useAttestations } from '@/identity/hooks/useAttestations';
import { COINBASE_VERIFIED_ACCOUNT_SCHEMA_ID } from '@/identity/constants';
import type { ReactNode } from 'react';
import type { Address } from 'viem';
import { useOnchainKit } from '../../useOnchainKit';
import { useIdentityContext } from './IdentityProvider';

type DisplayBadgeProps = {
  children: ReactNode;
  address?: Address;
};

export function DisplayBadge({ children, address }: DisplayBadgeProps) {
  const { chain } = useOnchainKit();
  const { schemaId: contextSchemaId, address: contextAddress } =
    useIdentityContext();
  const attestations = useAttestations({
    address: address ?? contextAddress,
    chain: chain,
    schemaId: contextSchemaId ?? COINBASE_VERIFIED_ACCOUNT_SCHEMA_ID,
  });

  if (attestations.length === 0) {
    return null;
  }

  return children;
}
