import { useMemo } from 'react';
import { useIdentityContext } from '../context';
import { getSlicedAddress } from '../getSlicedAddress';
import { useName } from '../hooks/useName';
import { WithNameBadge } from './WithNameBadge';
import type { NameReact } from '../types';

/**
 * Name is a React component that renders the user name from an Ethereum address.
 */
export function Name({
  address = null,
  className,
  showAddress,
  showAttestation,
  props,
}: NameReact) {
  const { address: contextAddress } = useIdentityContext();
  if (!contextAddress && !address) {
    throw new Error(
      'Name: an Ethereum address must be provided to the Identity or Name component.',
    );
  }

  const { data: name, isLoading } = useName({
    address: contextAddress ?? address,
    showAddress,
  });

  // Wrapped in useMemo to prevent unnecessary recalculations.
  const normalizedAddress = useMemo(() => {
    if (!name && !isLoading) {
      return getSlicedAddress(contextAddress ?? address);
    }
    return address;
  }, [address, contextAddress, isLoading, name]);

  if (isLoading) {
    return <span className={className} {...props} />;
  }

  // It displays the ENS name if available; otherwise, it shows either a sliced version of the address
  // or the full address, based on the 'sliced' prop. By default, 'sliced' is set to true.
  return (
    <WithNameBadge
      showAttestation={showAttestation}
      address={contextAddress ?? address}
    >
      <span className={className} {...props}>
        {name ?? normalizedAddress}
      </span>
    </WithNameBadge>
  );
}
