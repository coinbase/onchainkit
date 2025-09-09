'use client';
import { useIdentityContext } from '@/identity/components/IdentityProvider';
import { useAvatar } from '@/identity/hooks/useAvatar';
import { useName } from '@/identity/hooks/useName';
import type { AvatarProps } from '@/identity/types';
import { findComponent } from '@/internal/utils/findComponent';
import { Children, useMemo } from 'react';
import { defaultAvatarSVG } from '../../internal/svg/defaultAvatarSVG';
import { defaultLoadingSVG } from '../../internal/svg/defaultLoadingSVG';
import { cn } from '../../styles/theme';
import { Badge } from './Badge';
import { DisplayBadge } from './DisplayBadge';
import { useMiniKitAvatar } from '../hooks/useMiniKitAvatar';
import { useMiniKitName } from '../hooks/useMiniKitName';

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
}: AvatarProps) {
  const { address: contextAddress, chain: contextChain } = useIdentityContext();

  const accountAddress = address ?? contextAddress;
  const accountChain = chain ?? contextChain;

  // The component first attempts to retrieve the minikit name and avatar for the given Ethereum address.
  // Then it falls back to the ENS name and avatar.
  const miniKitAvatar = useMiniKitAvatar();
  const miniKitName = useMiniKitName();

  const { data: name, isLoading: isLoadingName } = useName(
    {
      address: accountAddress,
      chain: accountChain,
    },
    { enabled: !!accountAddress && !miniKitName },
  );

  const { data: avatar, isLoading: isLoadingAvatar } = useAvatar(
    { ensName: name ?? '', chain: accountChain },
    { enabled: !!name && !miniKitAvatar },
  );

  const badge = useMemo(() => {
    return Children.toArray(children).find(findComponent(Badge));
  }, [children]);

  const defaultAvatar = defaultComponent || defaultAvatarSVG;
  const loadingAvatar = loadingComponent || defaultLoadingSVG;

  const isLoading = isLoadingName || isLoadingAvatar;

  if (!accountAddress) {
    console.error(
      'Avatar: an Ethereum address must be provided to the Identity or Avatar component.',
    );
    return null;
  }

  // If the data is still loading, it displays a loading SVG.
  if (!miniKitName && isLoading) {
    return (
      <div className={cn('h-8 w-8 overflow-hidden rounded-full', className)}>
        {loadingAvatar}
      </div>
    );
  }

  const finalAvatar = miniKitAvatar || avatar;
  const finalName = miniKitName || name;

  const shouldDisplayAvatarImg = finalName && finalAvatar;

  // Otherwise, it displays the custom avatar obtained from ENS.
  return (
    <div className="relative">
      <div
        data-testid="ockAvatar_ImageContainer"
        className={cn('h-10 w-10 overflow-hidden rounded-full', className)}
      >
        {shouldDisplayAvatarImg ? (
          // biome-ignore lint/a11y/useAltText: alt is provided, seems like a bug
          <img
            className="min-h-full min-w-full object-cover"
            data-testid="ockAvatar_Image"
            loading="lazy"
            width="100%"
            height="100%"
            decoding="async"
            src={finalAvatar}
            alt={finalName}
            {...props}
          />
        ) : (
          <div className={cn('border-ock-background', 'h-full w-full border')}>
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
