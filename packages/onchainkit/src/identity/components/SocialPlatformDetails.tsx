import { githubSvg } from '../../internal/svg/githubSvg';
import { twitterSvg } from '../../internal/svg/twitterSvg';
import { warpcastSvg } from '../../internal/svg/warpcastSvg';
import { websiteSvg } from '../../internal/svg/websiteSvg';
import { cn, pressable } from '../../styles/theme';

export type SocialPlatform = 'twitter' | 'github' | 'farcaster' | 'website';

export const PLATFORM_CONFIG: Record<
  SocialPlatform,
  {
    href: (value: string) => string;
    icon: React.ReactNode;
    ariaLabel: (value: string) => string;
  }
> = {
  twitter: {
    href: (value) => `https://x.com/${value}`,
    icon: twitterSvg,
    ariaLabel: (value) => `Visit ${value} on X (formerly Twitter)`,
  },
  github: {
    href: (value) => `https://github.com/${value}`,
    icon: githubSvg,
    ariaLabel: (value) => `Visit ${value} on GitHub`,
  },
  farcaster: {
    href: (value) => {
      const username = value.split('/').pop();
      return `https://warpcast.com/${username}`;
    },
    icon: warpcastSvg,
    ariaLabel: (value) => {
      const username = value.split('/').pop();
      return `Visit ${username} on Farcaster (Warpcast)`;
    },
  },
  website: {
    href: (value) => value,
    icon: websiteSvg,
    ariaLabel: (value) => `Visit ${value}`,
  },
};

export function SocialPlatformDetails({
  platform,
  value,
}: {
  platform: SocialPlatform;
  value: string;
}) {
  const config = PLATFORM_CONFIG[platform];
  const ariaLabel = config.ariaLabel(value);
  return (
    <a
      href={config.href(value)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        pressable.default,
        'rounded-default',
        'border-background',
        'flex items-center justify-center p-2',
      )}
      data-testid={`ockSocials_${
        platform.charAt(0).toUpperCase() + platform.slice(1)
      }`}
      aria-label={ariaLabel}
    >
      <span className="sr-only">{platform}</span>
      <div className={cn('flex h-4 w-4 items-center justify-center')}>
        {config.icon}
      </div>
    </a>
  );
}
