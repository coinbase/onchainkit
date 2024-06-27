import type { IdentityReact } from '../types';
import { IdentityProvider } from './IdentityProvider';
import { IdentityLayout } from './IdentityLayout';
import { useCallback } from 'react';

export function Identity({
  address,
  children,
  className,
  schemaId,
  copyAddressOnClick,
}: IdentityReact) {
  // istanbul ignore next
  const handleCopy = useCallback(async () => {
    if (!address) return false;

    try {
      await navigator.clipboard.writeText(address);
      return true;
    } catch (e) {
      console.error('Failed to copy: ', e);
      return false;
    }
  }, [address]);

  // istanbul ignore next
  const onClick = copyAddressOnClick ? handleCopy : undefined;

  return (
    <IdentityProvider address={address} schemaId={schemaId}>
      <IdentityLayout className={className} onClick={onClick}>
        {children}
      </IdentityLayout>
    </IdentityProvider>
  );
}
