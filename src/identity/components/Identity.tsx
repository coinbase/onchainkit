import { useOnchainKit } from '../../useOnchainKit';
import type { IdentityReact } from '../types';
import { IdentityLayout } from './IdentityLayout';
import { IdentityProvider } from './IdentityProvider';

export function Identity({
  address,
  chain,
  children,
  className,
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
      <IdentityLayout className={className}>{children}</IdentityLayout>
    </IdentityProvider>
  );
}
