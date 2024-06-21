import type { BadgeReact } from '../types';
import { background, cn, fill } from '../../styles/theme';

/**
 * Badge component.
 */
export function Badge({ className }: BadgeReact) {
  // TODO: Implement the Badge component as span and CSS without an SVG element.
  const badgeSize = '12px';
  return (
    <span
      className={cn(
        background.primary,
        'rounded-full border border-transparent',
        className,
      )}
      data-testid="ockBadge"
      style={{
        height: badgeSize,
        width: badgeSize,
        maxHeight: badgeSize,
        maxWidth: badgeSize,
      }}
    >
      <svg
        role="img"
        aria-label="ock-attestation-icon"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <path
          d="M8.12957 3.73002L5.11957 6.74002L3.77957 5.40002C3.49957 5.12002 3.04957 5.12002 2.76957 5.40002C2.48957 5.68002 2.48957 6.13002 2.76957 6.41002L4.10957 7.75002L4.59957 8.24002C4.90957 8.55002 5.41957 8.55002 5.72957 8.24002L9.17957 4.79002C9.45957 4.51002 9.45957 4.06002 9.17957 3.78002L9.12957 3.73002C8.84957 3.45002 8.39957 3.45002 8.11957 3.73002H8.12957Z"
          data-testid="ockBadgeTicker"
          className={fill.inverse}
        />
      </svg>
    </span>
  );
}
