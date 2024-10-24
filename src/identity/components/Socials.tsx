import type { Address, Chain } from 'viem';
import { githubSvg } from '../../internal/svg/githubSvg';
import { twitterSvg } from '../../internal/svg/twitterSvg';
import { warpcastSvg } from '../../internal/svg/warpcastSvg';
import { websiteSvg } from '../../internal/svg/websiteSvg';
import { cn } from '../../styles/theme';
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

  console.log('socials data: ', socials);

  if (isLoadingName || isLoadingSocials) {
    return <span className={className} />;
  }
  console.log("Socials: ", socials)
  if (!socials || Object.values(socials).every((value) => !value)) {
    return null;
  }

  // Render social links
  return (
    <div className={cn('flex space-x-4', className)}>
      {Object.entries(socials).map(([platform, value]) => {
        if (!value) {
          return null;
        }
        let href = '';
        let icon = null;

        // Set up href and icon based on the platform
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
          case 'url': {
            href = value;
            icon = websiteSvg;
            break;
          }
        }

        // Render individual social link
        return (
          <a
            key={platform}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className='transition-opacity hover:opacity-80'
            data-testid={`ockSocials_${
              platform.charAt(0).toUpperCase() + platform.slice(1)
            }`}
          >
            <span className="sr-only">{platform}</span>
            {icon && (
              <div className="-translate-y-1/2 top-1/2 left-4 flex h-[1.125rem] w-[1.125rem] items-center justify-center">
                {icon}
              </div>
            )}
          </a>
        );
      })}
    </div>
  );
}
