import type { IdentityReact } from '../types';
import { IdentityProvider } from './IdentityProvider';
import { IdentityLayout } from './IdentityLayout';
import { useCallback } from 'react';
import { useOnchainKit } from '../../useOnchainKit';

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
