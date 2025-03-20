'use client';
import type { BadgeReact } from '@/identity/types';
import { badgeSvg } from '@/internal/svg/badgeSvg';
import { background, cn } from '@/styles/theme';

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
      {badgeSvg}
    </span>
  );
}
