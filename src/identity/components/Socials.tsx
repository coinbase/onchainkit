import { useEffect, useState } from 'react';
import type { SocialsReact } from '../types';
import { useIdentityContext } from './IdentityProvider';
import { cn } from '../../styles/theme';
import { getName } from '../utils/getName';
import { normalize } from 'viem/ens';

const BASENAME_L2_RESOLVER_ADDRESS =
  '0xc6d566a56a1aff6508b41f6c90ff131615583bcd';

export function Socials({ address = null, chain }: SocialsReact) {
  const { address: contextAddress } = useIdentityContext();

  const accountAddress = address ?? contextAddress;

  if (!accountAddress) {
    console.error(
      'Socials: an Ethereum address must be provided to the Socials component.'
    );
    return null;
  }

  const [ensText, setEnsText] = useState<{
    twitter?: string;
    github?: string;
    farcast?: string;
    website?: string;
  }>({});

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEnsText = async () => {
      if (accountAddress) {
        try {
          const cachedData = localStorage.getItem(accountAddress);
          if (cachedData) {
            setEnsText(JSON.parse(cachedData));
            setIsLoading(false);
            return;
          }

          const name = await getName({ chain: chain, address: accountAddress });
          const normalizedAddress = normalize(name as string);

          const [twitterText, githubText, urlText] = await Promise.all([
            publicClient.getEnsText({
              name: normalizedAddress,
              key: 'com.twitter',
              universalResolverAddress: BASENAME_L2_RESOLVER_ADDRESS,
            }),
            publicClient.getEnsText({
              name: normalizedAddress,
              key: 'com.github',
              universalResolverAddress: BASENAME_L2_RESOLVER_ADDRESS,
            }),
            publicClient.getEnsText({
              name: normalizedAddress,
              key: 'url',
              universalResolverAddress: BASENAME_L2_RESOLVER_ADDRESS,
            }),
          ]);

          const fetchedData = {
            twitter: twitterText,
            github: githubText,
            url: urlText,
          };
          setEnsText(fetchedData);
          localStorage.setItem(accountAddress, JSON.stringify(fetchedData));
        } catch (error) {
          console.error('Error fetching ENS text:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchEnsText();
  }, [accountAddress, accountChain, publicClient]);

  if (!accountAddress) {
    console.error(
      'Socials: an Ethereum address must be provided to the Identity or Socials component.'
    );
    return null;
  }

  if (isLoading) {
    return (
      <div className={cn('text-sm text-gray-500', className)}>
        Loading socials...
      </div>
    );
  }

  if (!ensText || (!ensText.twitter && !ensText.github && !ensText.url)) {
    return null;
  }

  return (
    <div className={cn('space-y-2 text-sm', className)} {...props}>
      {ensText.twitter && (
        <div data-testid="ockSocials_Twitter">
          <a
            href={`https://x.com/${ensText.twitter}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Twitter: {ensText.twitter}
          </a>
        </div>
      )}
      {ensText.github && (
        <div data-testid="ockSocials_GitHub">
          <a
            href={`https://github.com/${ensText.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            GitHub: {ensText.github}
          </a>
        </div>
      )}
      {ensText.url && (
        <div data-testid="ockSocials_Website">
          <a
            href={ensText.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Website: {ensText.url.replace(/^https?:\/\//, '')}
          </a>
        </div>
      )}
    </div>
  );
}
