import { useMemo } from 'react';
import type { Address } from 'viem';

import { getSlicedAddress } from '../getSlicedAddress';
import { useName } from '../hooks/useName';
import { WithNameBadge } from './WithNameBadge';

type NameProps = {
  address: Address;
  className?: string;
  sliced?: boolean;
  props?: React.HTMLAttributes<HTMLSpanElement>;
  displayBadge?: boolean;
};

/**
 * Name is a React component that renders the user name from an Ethereum address.
 * It displays the ENS name if available; otherwise, it shows either a sliced version of the address
 * or the full address, based on the 'sliced' prop. By default, 'sliced' is set to true.
 *
 * @param {Address} address - Ethereum address to be displayed.
 * @param {string} [className] - Optional CSS class for custom styling.
 * @param {boolean} [sliced=true] - Determines if the address should be sliced when no ENS name is available.
 * @param {React.HTMLAttributes<HTMLSpanElement>} [props] - Additional HTML attributes for the span element.
 */
export function Name({ address, className, sliced = true, displayBadge, props }: NameProps) {
  const { data: name, isLoading } = useName({ address });

  // wrapped in useMemo to prevent unnecessary recalculations.
  const normalizedAddress = useMemo(() => {
    if (!name && !isLoading && sliced) {
      return getSlicedAddress(address);
    }
    return address;
  }, [address, isLoading, sliced, name]);

  if (isLoading) {
    return null;
  }

  return (
    <WithNameBadge displayBadge={displayBadge} address={address}>
      <span className={className} {...props}>
        {name ?? normalizedAddress}
      </span>
    </WithNameBadge>
  );
}
