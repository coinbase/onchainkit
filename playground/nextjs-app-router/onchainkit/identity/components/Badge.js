import { badgeSvg } from '../../internal/svg/badgeSvg.js';
import { cn, background } from '../../styles/theme.js';
import { jsx } from 'react/jsx-runtime';

/**
 * Badge component.
 */
function Badge({
  className
}) {
  // TODO: Implement the Badge component as span and CSS without an SVG element.
  const badgeSize = '12px';
  return /*#__PURE__*/jsx("span", {
    className: cn(background.primary, 'rounded-full border border-transparent', className),
    "data-testid": "ockBadge",
    style: {
      height: badgeSize,
      width: badgeSize,
      maxHeight: badgeSize,
      maxWidth: badgeSize
    },
    children: badgeSvg
  });
}
export { Badge };
//# sourceMappingURL=Badge.js.map
