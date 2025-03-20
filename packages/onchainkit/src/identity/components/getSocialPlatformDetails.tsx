import { githubSvg } from '../../internal/svg/githubSvg';
import { twitterSvg } from '../../internal/svg/twitterSvg';
import { warpcastSvg } from '../../internal/svg/warpcastSvg';
import { websiteSvg } from '../../internal/svg/websiteSvg';
import { border, cn, pressable } from '../../styles/theme';

export type SocialPlatform = 'twitter' | 'github' | 'farcaster' | 'website';

export const PLATFORM_CONFIG: Record<
  SocialPlatform,
  { href: (value: string) => string; icon: React.ReactNode }
> = {
  twitter: {
    href: (value) => `https://x.com/${value}`,
    icon: twitterSvg,
  },
  github: {
    href: (value) => `https://github.com/${value}`,
    icon: githubSvg,
  },
  farcaster: {
    href: (value) => {
      const username = value.split('/').pop();
      return `https://warpcast.com/${username}`;
    },
    icon: warpcastSvg,
  },
  website: {
    href: (value) => value,
    icon: websiteSvg,
  },
};

export function GetSocialPlatformDetails({
  platform,
  value,
}: {
  platform: SocialPlatform;
  value: string;
}) {
  const config = PLATFORM_CONFIG[platform];
  return (
    <a
      href={config.href(value)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        pressable.default,
        border.radius,
        border.default,
        'flex items-center justify-center p-2',
      )}
      data-testid={`ockSocials_${
        platform.charAt(0).toUpperCase() + platform.slice(1)
      }`}
    >
      <span className="sr-only">{platform}</span>
      <div className={cn('flex h-4 w-4 items-center justify-center')}>
        {config.icon}
      </div>
    </a>
  );
}
