'use client';
import { IdentityLayout } from '@/identity/components/IdentityLayout';
import { IdentityProvider } from '@/identity/components/IdentityProvider';
import type { IdentityProps } from '@/identity/types';
import { useOnchainKit } from '@/onchainkit/hooks/useOnchainKit';
import { useAccount } from 'wagmi';

export function Identity({
  address: addressProp,
  chain,
  children,
  className,
  hasCopyAddressOnClick,
  schemaId,
}: IdentityProps) {
  const { chain: contextChain } = useOnchainKit();
  const accountChain = chain ?? contextChain;
  const { address } = useAccount();

  if (!address && !addressProp) {
    return null;
  }

  return (
    <IdentityProvider
      address={addressProp || address}
      schemaId={schemaId}
      chain={accountChain}
    >
      <IdentityLayout
        className={className}
        hasCopyAddressOnClick={hasCopyAddressOnClick}
      >
        {children}
      </IdentityLayout>
    </IdentityProvider>
  );
}
