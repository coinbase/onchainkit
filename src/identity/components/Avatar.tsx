import { useAvatar } from '../hooks/useAvatar';
import { useName } from '../hooks/useName';
import { WithAvatarBadge } from './WithAvatarBadge';
import { AvatarReact } from '../types';

/**
 * Represents an Avatar component that displays either a loading indicator,
 * a default avatar, or a custom avatar based on Ethereum Name Service (ENS).
 *
 * The component first attempts to retrieve the ENS name and avatar for the given Ethereum address.
 * If the data is still loading, it displays a loading SVG.
 *
 * If the ENS name or avatar is not available, it shows a default SVG avatar.
 * Otherwise, it displays the custom avatar obtained from ENS.
 */
export function Avatar({
  address,
  className,
  defaultComponent,
  loadingComponent,
  props,
  showAttestation = false,
}: AvatarReact) {
  const { data: name, isLoading: isLoadingName } = useName({ address });
  const { data: avatar, isLoading: isLoadingAvatar } = useAvatar(
    { ensName: name ?? '' },
    { enabled: !!name },
  );

  if (isLoadingName || isLoadingAvatar) {
    return (
      loadingComponent || (
        <svg
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

  if (!name || !avatar) {
    return (
      <WithAvatarBadge showAttestation={showAttestation} address={address}>
        {defaultComponent || (
          <svg
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

  return (
    <WithAvatarBadge showAttestation={showAttestation} address={address}>
      <img
        className={className}
        loading="lazy"
        width="32"
        height="32"
        decoding="async"
        src={avatar}
        alt={name}
        style={{ borderRadius: '50%' }}
        {...props}
      />
    </WithAvatarBadge>
  );
}
