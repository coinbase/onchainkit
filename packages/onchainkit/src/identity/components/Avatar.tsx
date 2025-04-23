'use client';
import { useIdentityContext } from '@/identity/components/IdentityProvider';
import { useAvatar } from '@/identity/hooks/useAvatar';
import { useName } from '@/identity/hooks/useName';
import type { AvatarReact } from '@/identity/types';
import { findComponent } from '@/internal/utils/findComponent';
import { Children, useMemo } from 'react';
import { defaultAvatarSVG } from '../../internal/svg/defaultAvatarSVG';
import { defaultLoadingSVG } from '../../internal/svg/defaultLoadingSVG';
import { border, cn } from '../../styles/theme';
import { Badge } from './Badge';
import { DisplayBadge } from './DisplayBadge';

/**
 * Represents an Avatar component that displays either a loading indicator,
 * a default avatar, or a custom avatar based on Ethereum Name Service (ENS).
 */
export function Avatar({
  address = null,
  chain,
  className,
  defaultComponent,
  loadingComponent,
  children,
  ...props
}: AvatarReact) {
  const { address: contextAddress, chain: contextChain } = useIdentityContext();

  const accountAddress = address ?? contextAddress;
  const accountChain = chain ?? contextChain;

  if (!accountAddress) {
    console.error(
      'Avatar: an Ethereum address must be provided to the Identity or Avatar component.',
    );
    return null;
  }

  // The component first attempts to retrieve the ENS name and avatar for the given Ethereum address.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: name, isLoading: isLoadingName } = useName({
    address: accountAddress,
    chain: accountChain,
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: avatar, isLoading: isLoadingAvatar } = useAvatar(
    { ensName: name ?? '', chain: accountChain },
    { enabled: !!name },
  );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const badge = useMemo(() => {
    return Children.toArray(children).find(findComponent(Badge));
  }, [children]);

  const defaultAvatar = defaultComponent || defaultAvatarSVG;
  const loadingAvatar = loadingComponent || defaultLoadingSVG;

  // If the data is still loading, it displays a loading SVG.
  if (isLoadingName || isLoadingAvatar) {
    return (
      <div className={cn('h-8 w-8 overflow-hidden rounded-full', className)}>
        {loadingAvatar}
      </div>
    );
  }

  const displayAvatarImg = name && avatar;

  // Otherwise, it displays the custom avatar obtained from ENS.
  return (
    <div className="relative">
      <div
        data-testid="ockAvatar_ImageContainer"
        className={cn('h-10 w-10 overflow-hidden rounded-full', className)}
      >
        {displayAvatarImg ? (
          <img
            className="min-h-full min-w-full object-cover"
            data-testid="ockAvatar_Image"
            loading="lazy"
            width="100%"
            height="100%"
            decoding="async"
            src={avatar}
            alt={name}
            {...props}
          />
        ) : (
          <div className={cn(border.default, 'h-full w-full border')}>
            {defaultAvatar}
          </div>
        )}
      </div>
      {badge && (
        <DisplayBadge address={accountAddress}>
          <div
            data-testid="ockAvatar_BadgeContainer"
            className="-bottom-0.5 -right-0.5 absolute flex h-[15px] w-[15px] items-center justify-center rounded-full bg-transparent"
          >
            <div className="flex h-3 w-3 items-center justify-center">
              {badge}
            </div>
          </div>
        </DisplayBadge>
      )}
    </div>
  );
}
