import { useMemo, Children } from 'react';
import { useIdentityContext } from './IdentityProvider';
import { useAvatar } from '../hooks/useAvatar';
import { useName } from '../hooks/useName';
import type { AvatarReact } from '../types';
import { cn } from '../../styles/theme';
import { DisplayBadge } from './DisplayBadge';
import { Badge } from './Badge';
import { defaultAvatarSVG } from './defaultAvatarSVG';
import { defaultLoadingSVG } from './defaultLoadingSVG';

/**
 * Represents an Avatar component that displays either a loading indicator,
 * a default avatar, or a custom avatar based on Ethereum Name Service (ENS).
 */
export function Avatar({
  address = null,
  className,
  defaultComponent,
  loadingComponent,
  children,
  ...props
}: AvatarReact) {
  const { address: contextAddress } = useIdentityContext();
  if (!contextAddress && !address) {
    throw new Error(
      'Avatar: an Ethereum address must be provided to the Identity or Avatar component.',
    );
  }

  // The component first attempts to retrieve the ENS name and avatar for the given Ethereum address.
  const { data: name, isLoading: isLoadingName } = useName({
    address: contextAddress ?? address,
  });
  const { data: avatar, isLoading: isLoadingAvatar } = useAvatar(
    { ensName: name ?? '' },
    { enabled: !!name },
  );

  const badge = useMemo(() => {
    // @ts-ignore
    return Children.toArray(children).find(({ type }) => type === Badge);
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
        className={cn('h-8 w-8 overflow-hidden rounded-full', className)}
      >
        {/* biome-ignore lint: alt gets assigned */}
        {displayAvatarImg ? (
          <img
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
          defaultAvatar
        )}
      </div>
      {badge && (
        <DisplayBadge address={contextAddress ?? address}>
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
