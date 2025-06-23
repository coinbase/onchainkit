'use client';
import { useIdentityContext } from '@/identity/components/IdentityProvider';
import { useName } from '@/identity/hooks/useName';
import type { NameProps } from '@/identity/types';
import { getSlicedAddress } from '@/identity/utils/getSlicedAddress';
import { findComponent } from '@/internal/utils/findComponent';
import { Children, useMemo } from 'react';
import { cn, text } from '../../styles/theme';
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
}: NameProps) {
  const { address: contextAddress, chain: contextChain } = useIdentityContext();

  const accountAddress = address ?? contextAddress;
  const accountChain = chain ?? contextChain;

  const { data: name, isLoading } = useName({
    address: accountAddress,
    chain: accountChain,
  });

  const badge = useMemo(() => {
    return Children.toArray(children).find(findComponent(Badge));
  }, [children]);

  const ariaLabel = useMemo(() => {
    if (name) {
      return `User identity: ${name}, verified name`;
    }
    return `User identity: ${accountAddress}, Ethereum address`;
  }, [accountAddress, name]);

  if (!contextAddress && !address) {
    console.error(
      'Name: an Ethereum address must be provided to the Identity or Name component.',
    );
    return null;
  }

  if (isLoading) {
    return <span className={className} />;
  }

  return (
    <div className="flex items-center gap-1">
      <span
        data-testid="ockIdentity_Text"
        className={cn(text.headline, 'text-ock-foreground', className)}
        {...props}
        aria-label={ariaLabel}
      >
        {name || getSlicedAddress(accountAddress)}
      </span>
      {badge && <DisplayBadge address={accountAddress}>{badge}</DisplayBadge>}
    </div>
  );
}
