import { useCallback } from 'react';
import { useOnchainKit } from '../../useOnchainKit';
import type { IdentityReact } from '../types';
import { IdentityLayout } from './IdentityLayout';
import { IdentityProvider } from './IdentityProvider';

export function Identity({
  address,
  children,
  className,
  schemaId,
  hasCopyAddressOnClick = false,
  chain,
}: IdentityReact) {
  // istanbul ignore next
  const { chain: contextChain } = useOnchainKit();

  const accountChain = contextChain || chain;

  const handleCopy = useCallback(async () => {
    if (!address) {
      return false;
    }
    try {
      await navigator.clipboard.writeText(address);
      return true;
    } catch (e) {
      console.error('Failed to copy: ', e);
      return false;
    }
  }, [address]);

  // istanbul ignore next
  const onClick = hasCopyAddressOnClick ? handleCopy : undefined;

  return (
    <IdentityProvider
      address={address}
      schemaId={schemaId}
      chain={accountChain}
    >
      <IdentityLayout className={className} onClick={onClick}>
        {children}
      </IdentityLayout>
    </IdentityProvider>
  );
}
