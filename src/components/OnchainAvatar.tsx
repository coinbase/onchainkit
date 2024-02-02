import { useOnchainAvatar } from '../hooks/useOnchainAvatar';
import { useOnchainName } from '../hooks/useOnchainName';
import type { Address } from 'viem';

type OnchainAvatarProps = {
  address: Address;
  className?: string;
  props?: React.ImgHTMLAttributes<HTMLImageElement>;
};

export function OnchainAvatar({ address, className, props }: OnchainAvatarProps) {
  const { ensName, isLoading: isLoadingName } = useOnchainName(address);
  const { ensAvatar, isLoading: isLoadingAvatar } = useOnchainAvatar(ensName as string);

  if (isLoadingName || isLoadingAvatar) {
    return (
      <svg width="32px" height="32px" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="#333"
          fill="none"
          stroke-width="10"
          stroke-linecap="round"
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
    );
  }

  if (!ensName || !ensAvatar) {
    // https://github.com/wevm/wagmi/issues/554
    return (
      <svg xmlns="http://www.w3.org/2000/svg" height="32" width="32">
        <circle fill="blue" cx="16" cy="16" r="16" />
      </svg>
    );
  }

  return (
    <img
      className={className ?? 'rounded-full'}
      loading="lazy"
      width="32"
      height="32"
      decoding="async"
      src={ensAvatar}
      alt={ensName}
      {...props}
    />
  );
}
