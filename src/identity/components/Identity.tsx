import { useCallback } from 'react';
import { useOnchainKit } from '../../useOnchainKit';
import type { IdentityReact } from '../types';
import { IdentityLayout } from './IdentityLayout';
import { IdentityProvider } from './IdentityProvider';
import { Name } from './Name';
import { Avatar } from './Avatar';
import { EthBalance } from './EthBalance';
import { Address } from './Address';

const DEFAULT_CHILDREN = [
  <Avatar key="avatar" />,
  <Name key="name" />,
  <Address key="address" />,
  <EthBalance key="ethBalance" />
];

export function Identity({
  address,
  chain,
  children = DEFAULT_CHILDREN,
  className,
  hasCopyAddressOnClick = false,
  schemaId,
}: IdentityReact) {
  const { chain: contextChain } = useOnchainKit();
  const accountChain = chain ?? contextChain;

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
