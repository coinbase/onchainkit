'use client';
import { useIdentityContext } from '@/identity/components/IdentityProvider';
import { useAvatar } from '@/identity/hooks/useAvatar';
import { useName } from '@/identity/hooks/useName';
import type { AvatarProps } from '@/identity/types';
import { findComponent } from '@/internal/utils/findComponent';
import { Children, ImgHTMLAttributes, ReactNode, useMemo } from 'react';
import { defaultAvatarSVG } from '../../internal/svg/defaultAvatarSVG';
import { defaultLoadingSVG } from '../../internal/svg/defaultLoadingSVG';
import { cn } from '../../styles/theme';
import { Badge } from './Badge';
import { DisplayBadge } from './DisplayBadge';
import { Address } from 'viem';

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
  const { address: contextAddress } = useIdentityContext();
  const accountAddress = address ?? contextAddress;

  if (!accountAddress) {
    console.error(
      'Avatar: an Ethereum address must be provided to the Identity or Avatar component.',
    );
    return null;
  }

  return (
    <AvatarContent
      address={address}
      chain={chain}
      className={className}
      defaultComponent={defaultComponent}
      loadingComponent={loadingComponent}
      {...props}
    >
      {children}
    </AvatarContent>
  );
}

function AvatarContent({
  address = null,
  chain,
  className,
  defaultComponent,
  loadingComponent,
  children,
  name: nameOverride,
  avatar: avatarOverride,
  ...props
}: AvatarProps) {
  const { address: contextAddress, chain: contextChain } = useIdentityContext();

  const accountAddress = address ?? contextAddress;
  const accountChain = chain ?? contextChain;

  const { data: name, isLoading: isLoadingName } = useName({
    address: accountAddress,
    chain: accountChain,
  });

  const { data: avatar, isLoading: isLoadingAvatar } = useAvatar(
    { ensName: name ?? '', chain: accountChain },
    { enabled: !!name },
  );

  const { resolvedName, resolvedAvatar } = useMemo(() => {
    return {
      resolvedName: nameOverride ?? name ?? '',
      resolvedAvatar: avatarOverride ?? avatar ?? '',
    };
  }, [name, avatar, nameOverride, avatarOverride]);

  const badge = useMemo(() => {
    return Children.toArray(children).find(findComponent(Badge));
  }, [children]);

  const defaultAvatar = defaultComponent || defaultAvatarSVG;
  const loadingAvatar = loadingComponent || defaultLoadingSVG;

  if (isLoadingName || isLoadingAvatar) {
    return (
      <div className={cn('h-8 w-8 overflow-hidden rounded-full', className)}>
        {loadingAvatar}
      </div>
    );
  }

  return (
    <AvatarRenderer
      avatar={resolvedAvatar}
      name={resolvedName}
      defaultAvatar={defaultAvatar}
      badge={badge}
      accountAddress={accountAddress}
      className={className}
      {...props}
    />
  );
}

function AvatarRenderer({
  className,
  avatar,
  name,
  defaultAvatar,
  badge,
  accountAddress,
  ...rest
}: {
  className?: string;
  avatar: string;
  name: string;
  defaultAvatar: ReactNode;
  badge: ReactNode;
  accountAddress: Address;
} & ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <div className="relative">
      <div
        data-testid="ockAvatar_ImageContainer"
        className={cn('h-10 w-10 overflow-hidden rounded-full', className)}
      >
        {name && avatar ? (
          <img
            className="min-h-full min-w-full object-cover"
            data-testid="ockAvatar_Image"
            loading="lazy"
            width="100%"
            height="100%"
            decoding="async"
            src={avatar}
            alt={name}
            {...rest}
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
