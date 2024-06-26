import type { IdentityReact } from '../types';
import { IdentityProvider } from './IdentityProvider';
import { IdentityLayout } from './IdentityLayout';

export function Identity({
  address,
  children,
  className,
  schemaId,
}: IdentityReact) {
  return (
    <IdentityProvider address={address} schemaId={schemaId}>
      <IdentityLayout className={className}>{children}</IdentityLayout>
    </IdentityProvider>
  );
}
