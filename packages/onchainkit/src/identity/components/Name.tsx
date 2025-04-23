'use client';
import { useIdentityContext } from '@/identity/components/IdentityProvider';
import { useName } from '@/identity/hooks/useName';
import type { NameReact } from '@/identity/types';
import { getSlicedAddress } from '@/identity/utils/getSlicedAddress';
import { findComponent } from '@/internal/utils/findComponent';
import { Children, useMemo } from 'react';
import { cn, color, text } from '../../styles/theme';
import { Badge } from './Badge';
import { DisplayBadge } from './DisplayBadge';

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

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: name, isLoading } = useName({
    address: accountAddress,
    chain: accountChain,
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
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
