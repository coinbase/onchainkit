import { useMemo } from 'react';

import { useName } from '../hooks/useName';
import { getSlicedAddress } from '../getSlicedAddress';
import { WithNameBadge } from './WithNameBadge';
import type { NameReact } from '../types';

/**
 * Name is a React component that renders the user name from an Ethereum address.
 * It displays the ENS name if available; otherwise, it shows either a sliced version of the address
 * or the full address, based on the 'sliced' prop. By default, 'sliced' is set to true.
 */
export function Name({ address, className, showAddress, showAttestation, props }: NameReact) {
  const { data: name, isLoading } = useName({ address, showAddress });

  // Wrapped in useMemo to prevent unnecessary recalculations.
  const normalizedAddress = useMemo(() => {
    if (!name && !isLoading) {
      return getSlicedAddress(address);
    }
    return address;
  }, [address, isLoading, name]);

  if (isLoading) {
    return <span className={className} {...props} />;
  }

  return (
    <WithNameBadge showAttestation={showAttestation} address={address}>
      <span className={className} {...props}>
        {name ?? normalizedAddress}
      </span>
    </WithNameBadge>
  );
}
