'use client';
import { IdentityProvider } from '@/identity/components/IdentityProvider';
import type { IdentityReact } from '@/identity/types';
import { useOnchainKit } from '@/core-react/useOnchainKit';
import { IdentityLayout } from '@/identity/components/IdentityLayout';

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
