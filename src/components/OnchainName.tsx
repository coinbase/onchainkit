import React, { useMemo } from 'react';
import { getSlicedAddress } from '../core/address';
import { useEnsName } from '../hooks/useEnsName';
import type { Address } from 'viem';

type OnchainNameProps = {
  address?: Address;
  className?: string;
  sliced?: boolean;
  props?: React.HTMLAttributes<HTMLSpanElement>;
};

/**
 * OnchainAddress is a React component that renders an Ethereum address.
 * It displays the ENS name if available; otherwise, it shows either a sliced version of the address
 * or the full address, based on the 'sliced' prop. By default, 'sliced' is set to true.
 *
 * @param {Address} address - Ethereum address to be displayed.
 * @param {string} [className] - Optional CSS class for custom styling.
 * @param {boolean} [sliced=true] - Determines if the address should be sliced when no ENS name is available.
 * @param {React.HTMLAttributes<HTMLSpanElement>} [props] - Additional HTML attributes for the span element.
 */
export function OnchainName({ address, className, sliced = true, props }: OnchainNameProps) {
  const { ensName } = useEnsName(address);

  const normilizedAddress = useMemo(() => {
    if (sliced) {
      return getSlicedAddress(address);
    }

    return address;
  }, [address]);

  return (
    <span className={className} {...props}>
      {ensName ?? normilizedAddress}
    </span>
  );
}
