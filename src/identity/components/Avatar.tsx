import { useAvatar } from '../hooks/useAvatar';
import { useName } from '../hooks/useName';
import type { Address } from 'viem';

type AvatarProps = {
  address: Address;
  className?: string;
  loadingComponent?: JSX.Element;
  defaultComponent?: JSX.Element;
  props?: React.ImgHTMLAttributes<HTMLImageElement>;
};

/**
 * Represents an Avatar component that displays either a loading indicator, a default avatar, or a custom avatar based on Ethereum Name Service (ENS).
 *
 * The component first attempts to retrieve the ENS name and avatar for the given Ethereum address. If the data is still loading, it displays a loading SVG.
 * If the ENS name or avatar is not available, it shows a default SVG avatar. Otherwise, it displays the custom avatar obtained from ENS.
 *
 * @param {Address} props.address - The Ethereum address for which to display the avatar.
 * @param {string} [props.className] - Optional additional CSS class to apply to the avatar.
 * @param {JSX.Element} [props.loadingComponent] - Optional custom component to display while the avatar data is loading.
 * @param {JSX.Element} [props.defaultComponent] - Optional custom component to display when no ENS name or avatar is available.
 * @param {React.ImgHTMLAttributes<HTMLImageElement>} [props.props] - Optional additional image attributes to apply to the avatar.
 * @returns {JSX.Element} The JSX element representing the avatar, which could be a loading SVG, a default SVG, or an image.
 */
export function Avatar({
  address,
  className,
  loadingComponent,
  defaultComponent,
  props,
}: AvatarProps) {
  const { data: name, isLoading: isLoadingName } = useName({ address });
  const { data: avatar, isLoading: isLoadingAvatar } = useAvatar(
    { ensName: name ?? '' },
    { enabled: !!name },
  );

  if (isLoadingName || isLoadingAvatar) {
    return (
      loadingComponent || (
        <svg
          data-testid="avatar-loading-svg"
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
      defaultComponent || (
        <svg
          data-testid="avatar-default-svg"
          xmlns="http://www.w3.org/2000/svg"
          height="32"
          width="32"
        >
          <circle fill="blue" cx="16" cy="16" r="16" />
        </svg>
      )
    );
  }

  return (
    <img
      className={className}
      loading="lazy"
      width="32"
      height="32"
      decoding="async"
      src={avatar}
      alt={name}
      {...props}
    />
  );
}
