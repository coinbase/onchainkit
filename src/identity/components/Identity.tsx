import { useOnchainKit } from '../../useOnchainKit';
import type { IdentityReact } from '../types';
import { IdentityLayout } from './IdentityLayout';
import { IdentityProvider } from './IdentityProvider';

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
