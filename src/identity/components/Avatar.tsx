import { useIdentityContext } from '../context';
import { useAvatar } from '../hooks/useAvatar';
import { useName } from '../hooks/useName';
import { WithAvatarBadge } from './WithAvatarBadge';
import type { AvatarReact } from '../types';
import { cn } from '../../utils/cn';

/**
 * Represents an Avatar component that displays either a loading indicator,
 * a default avatar, or a custom avatar based on Ethereum Name Service (ENS).
 */
export function Avatar({
  address = null,
  className,
  defaultComponent,
  loadingComponent,
  props,
  showAttestation = false,
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

  // If the data is still loading, it displays a loading SVG.
  if (isLoadingName || isLoadingAvatar) {
    return (
      loadingComponent || (
        <svg
          role="img"
          aria-label="ock-avatar-loading-image"
          data-testid="ockAvatarLoadingSvg"
          width="32"
          height="32"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#333"
            fill="none"
            strokeWidth="10"
            strokeLinecap="round"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      )
    );
  }

  // If the ENS name or avatar is not available, it shows a default SVG avatar.
  if (!name || !avatar) {
    return (
      <WithAvatarBadge
        showAttestation={showAttestation}
        address={contextAddress ?? address}
      >
        {defaultComponent || (
          <svg
            role="img"
            aria-label="ock-avatar-default-svg"
            data-testid="ockAvatarDefaultSvg"
            xmlns="http://www.w3.org/2000/svg"
            height="32"
            width="32"
          >
            <circle fill="blue" cx="16" cy="16" r="16" />
          </svg>
        )}
      </WithAvatarBadge>
    );
  }

  // Otherwise, it displays the custom avatar obtained from ENS.
  return (
    <WithAvatarBadge
      showAttestation={showAttestation}
      address={contextAddress ?? address}
    >
      {/* biome-ignore lint: alt gets assigned */}
      <img
        className={cn('rounded-full', className)}
        data-testid="ockAvatar_Image"
        loading="lazy"
        width="32"
        height="32"
        decoding="async"
        src={avatar}
        alt={name}
        {...props}
      />
    </WithAvatarBadge>
  );
}
