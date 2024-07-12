import { Children, useMemo } from 'react';
import { useIdentityContext } from './IdentityProvider';
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
  chain,
  ...props
}: NameReact) {
  const { address: contextAddress } = useIdentityContext();
  if (!contextAddress && !address) {
    throw new Error(
      'Name: an Ethereum address must be provided to the Identity or Name component.',
    );
  }

  const accountAddress = contextAddress ?? address;

  const { data: name, isLoading } = useName({
    address: accountAddress,
    chain,
  });

  const badge = useMemo(() => {
    // @ts-ignore
    // istanbul ignore next
    return Children.toArray(children).find(({ type }) => type === Badge);
  }, [children]);

  if (isLoading) {
    return <span className={className} />;
  }

  if (!name) {
    return null;
  }

  return (
    <div className="flex items-center gap-1">
      <span
        data-testid="ockIdentity_Text"
        className={cn(text.headline, className)}
        {...props}
      >
        {name}
      </span>
      {badge && <DisplayBadge address={accountAddress}>{badge}</DisplayBadge>}
    </div>
  );
}
