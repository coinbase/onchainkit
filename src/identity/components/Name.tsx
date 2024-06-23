import { Children, useMemo } from 'react';
import { useIdentityContext } from '../context';
import { getSlicedAddress } from '../getSlicedAddress';
import { useName } from '../hooks/useName';
import type { NameReact } from '../types';
import { Badge } from './Badge';
import { DisplayBadge } from './DisplayBadge';
import { cn, text } from '../../styles/theme';

/**
 * Name is a React component that renders the user name from an Ethereum address.
 */
export function Name({
  address = null,
  className,
  children,
  ...props
}: NameReact) {
  const { address: contextAddress } = useIdentityContext();
  if (!contextAddress && !address) {
    throw new Error(
      'Name: an Ethereum address must be provided to the Identity or Name component.',
    );
  }

  const { data: name, isLoading } = useName({
    address: contextAddress ?? address,
  });

  const badge = useMemo(() => {
    // @ts-ignore
    // istanbul ignore next
    return Children.toArray(children).find(({ type }) => type === Badge);
  }, [children]);

  if (isLoading) {
    return <span className={className} />;
  }

  // It displays the ENS name if available; otherwise, it shows either a sliced version of the address
  // or the full address, based on the 'sliced' prop. By default, 'sliced' is set to true.
  return (
    <div className="flex items-center gap-1">
      <span
        data-testid="ockIdentity_Text"
        className={cn(text.headline, className)}
        {...props}
      >
        {name ?? getSlicedAddress(contextAddress ?? address)}
      </span>
      {badge && (
        <DisplayBadge address={contextAddress ?? address}>{badge}</DisplayBadge>
      )}
    </div>
  );
}
