'use client';
import { useOnchainKit } from '@/useOnchainKit';
import { IdentityLayout } from '@/identity/components/IdentityLayout';
import { IdentityProvider } from '@/identity/components/IdentityProvider';
import type { IdentityReact } from '@/identity/types';

export function Identity({
  address,
  chain,
  children,
  className,
  hasCopyAddressOnClick,
  schemaId,
}: IdentityReact) {
  const { chain: contextChain } = useOnchainKit();
  const accountChain = chain ?? contextChain;

  return (
    <IdentityProvider
      address={address}
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
