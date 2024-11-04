import { githubSvg } from '../../internal/svg/githubSvg.js';
import { twitterSvg } from '../../internal/svg/twitterSvg.js';
import { warpcastSvg } from '../../internal/svg/warpcastSvg.js';
import { websiteSvg } from '../../internal/svg/websiteSvg.js';
import { cn, pressable, border } from '../../styles/theme.js';
import { jsxs, jsx } from 'react/jsx-runtime';
const PLATFORM_CONFIG = {
  twitter: {
    href: value => `https://x.com/${value}`,
    icon: twitterSvg
  },
  github: {
    href: value => `https://github.com/${value}`,
    icon: githubSvg
  },
  farcaster: {
    href: value => value,
    icon: warpcastSvg
  },
  website: {
    href: value => value,
    icon: websiteSvg
  }
};
function GetSocialPlatformDetails({
  platform,
  value
}) {
  const config = PLATFORM_CONFIG[platform];
  return /*#__PURE__*/jsxs("a", {
    href: config.href(value),
    target: "_blank",
    rel: "noopener noreferrer",
    className: cn(pressable.default, border.radius, border.default, 'flex items-center justify-center p-2'),
    "data-testid": `ockSocials_${platform.charAt(0).toUpperCase() + platform.slice(1)}`,
    children: [/*#__PURE__*/jsx("span", {
      className: "sr-only",
      children: platform
    }), /*#__PURE__*/jsx("div", {
      className: cn('flex h-4 w-4 items-center justify-center'),
      children: config.icon
    })]
  });
}
export { GetSocialPlatformDetails, PLATFORM_CONFIG };
//# sourceMappingURL=getSocialPlatformDetails.js.map
