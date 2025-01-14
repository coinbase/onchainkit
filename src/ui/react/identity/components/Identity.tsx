'use client';
import { IdentityProvider } from '@/core-react/identity/providers/IdentityProvider';
import type { IdentityReact } from '@/core-react/identity/types';
import { useOnchainKit } from '@/core-react/useOnchainKit';
import { IdentityLayout } from '@/ui-react/identity/components/IdentityLayout';

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
