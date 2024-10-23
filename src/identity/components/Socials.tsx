import type { Address, Chain } from 'viem';
import { githubSvg } from '../../internal/svg/githubSvg';
import { twitterSvg } from '../../internal/svg/twitterSvg';
import { warpcastSvg } from '../../internal/svg/warpcastSvg';
import { websiteSvg } from '../../internal/svg/websiteSvg';
import { border, cn, pressable } from '../../styles/theme';
import { useName } from '../hooks/useName';
import { useSocials } from '../hooks/useSocials';
import { useIdentityContext } from './IdentityProvider';

type SocialsReact = {
  address?: Address | null;
  ensName?: string;
  chain?: Chain;
  className?: string;
};

export function Socials({ address, chain, className }: SocialsReact) {
  const { address: contextAddress, chain: contextChain } = useIdentityContext();

  const accountAddress = address ?? contextAddress;
  const accountChain = chain ?? contextChain;

  if (!accountAddress) {
    console.error(
      'Socials: an Ethereum address must be provided to the Socials component.',
    );
    return null;
  }

  const { data: name, isLoading: isLoadingName } = useName({
    address: accountAddress,
    chain: accountChain,
  });

  const { data: socials, isLoading: isLoadingSocials } = useSocials(
    {
      ensName: name ?? '',
      chain: accountChain,
    },
    { enabled: !!name },
  );

  if (isLoadingName || isLoadingSocials) {
    return <span className={className} />;
  }

  if (!socials || Object.values(socials).every((value) => !value)) {
    return null;
  }

  return (
    <div className={cn(border.default, 'mt-2 w-full pl-1', className)}>
      <div className={'left-4 flex space-x-2'}>
        {Object.entries(socials).map(([platform, value]) => {
          if (!value) {
            return null;
          }
          let href = '';
          let icon = null;

          switch (platform) {
            case 'twitter': {
              href = `https://x.com/${value}`;
              icon = twitterSvg;
              break;
            }
            case 'github': {
              href = `https://github.com/${value}`;
              icon = githubSvg;
              break;
            }
            case 'farcaster': {
              href = `https://warpcast.com/${value}`;
              icon = warpcastSvg;
              break;
            }
            case 'website': {
              href = value;
              icon = websiteSvg;
              break;
            }
          }

          return (
            <a
              key={platform}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                pressable.default,
                border.radius,
                border.default,
                'flex items-center justify-center p-2 transition-opacity',
              )}
              data-testid={`ockSocials_${
                platform.charAt(0).toUpperCase() + platform.slice(1)
              }`}
            >
              <span className="sr-only">{platform}</span>
              {icon && (
                <div className={cn('flex h-4 w-4 items-center justify-center')}>
                  {icon}
                </div>
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}
