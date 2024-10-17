import { Children, useMemo } from 'react';
import { findComponent } from '../../internal/utils/findComponent';
import { cn, color, text } from '../../styles/theme';
import { useName } from '../hooks/useName';
import type { NameReact } from '../types';
import { getSlicedAddress } from '../utils/getSlicedAddress';
import { Badge } from './Badge';
import { DisplayBadge } from './DisplayBadge';
import { useIdentityContext } from './IdentityProvider';

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
  const { address: contextAddress, chain: contextChain } = useIdentityContext();
  if (!contextAddress && !address) {
    console.error(
      'Name: an Ethereum address must be provided to the Identity or Name component.',
    );
    return null;
  }

  const accountAddress = address ?? contextAddress;
  const accountChain = chain ?? contextChain;

  const { data: name, isLoading } = useName({
    address: accountAddress,
    chain: accountChain,
  });

  const badge = useMemo(() => {
    return Children.toArray(children).find(findComponent(Badge));
  }, [children]);

  if (isLoading) {
    return <span className={className} />;
  }

  return (
    <div className="flex items-center gap-1">
      <span
        data-testid="ockIdentity_Text"
        className={cn(text.headline, color.foreground, className)}
        {...props}
      >
        {name || getSlicedAddress(accountAddress)}
      </span>
      {badge && <DisplayBadge address={accountAddress}>{badge}</DisplayBadge>}
    </div>
  );
}
