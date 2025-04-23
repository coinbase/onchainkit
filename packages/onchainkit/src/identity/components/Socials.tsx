'use client';
import { useIdentityContext } from '@/identity/components/IdentityProvider';
import { useName } from '@/identity/hooks/useName';
import { useSocials } from '@/identity/hooks/useSocials';
import { border, cn } from '@/styles/theme';
import type { Address, Chain } from 'viem';
import { GetSocialPlatformDetails } from './getSocialPlatformDetails';
import type { SocialPlatform } from './getSocialPlatformDetails';

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

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: name, isLoading: isLoadingName } = useName({
    address: accountAddress,
    chain: accountChain,
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
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
        {Object.entries(socials).map(
          ([platform, value]) =>
            value && (
              <GetSocialPlatformDetails
                key={platform}
                platform={platform as SocialPlatform}
                value={value}
              />
            ),
        )}
      </div>
    </div>
  );
}
