import { Children, useMemo } from 'react';
import { Avatar } from './Avatar';
import { Name } from './Name';
import { Address } from './Address';
import type { IdentityReact } from '../types';
import { background, cn } from '../../styles/theme';
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
