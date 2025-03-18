'use client';
import { useAttestations } from '@/identity/hooks/useAttestations';
import type { BadgeReact } from '@/identity/types';
import { Popover } from '@/internal/components/Popover';
import { badgeSvg } from '@/internal/svg/badgeSvg';
import { background, cn } from '@/styles/theme';
import { border, color, pressable, text } from '@/styles/theme';
import { useOnchainKit } from '@/useOnchainKit';
import { useCallback, useRef, useState } from 'react';
import { useIdentityContext } from './IdentityProvider';

/**
 * Badge component.
 */
export function Badge({
  className,
  tooltipText,
  tooltip = !!tooltipText, // Default to true if tooltipText exists
}: BadgeReact) {
  // TODO: Implement the Badge component as span and CSS without an SVG element.
  const badgeRef = useRef<HTMLSpanElement>(null);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const { chain, schemaId } = useOnchainKit();
  const { schemaId: contextSchemaId, address: contextAddress } =
    useIdentityContext();

  const attestations = useAttestations({
    address: contextAddress,
    chain,
    schemaId: contextSchemaId ?? schemaId,
  });

  const handleMouseEnter = useCallback(() => {
    if (tooltip) {
      setIsTooltipOpen(true);
    }
  }, [tooltip]);

  const handleMouseLeave = useCallback(() => {
    setIsTooltipOpen(false);
  }, []);

  // Use tooltipText if provided, otherwise fall back to the attestation name
  const displayText =
    tooltipText ??
    (attestations[0]?.decodedDataJson
      ? JSON.parse(attestations[0].decodedDataJson)[0]?.name
      : null);

  return (
    <div className="relative inline-block">
      <span
        ref={badgeRef}
        className={cn(
          background.primary,
          'h-3 w-3 max-h-3 max-w-3',
          'rounded-full border border-transparent inline-block',
          tooltip && 'cursor-default group',
          className,
        )}
        data-testid="ockBadge"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {badgeSvg}
      </span>
      {tooltip && displayText && (
        <Popover
          anchor={badgeRef.current}
          isOpen={isTooltipOpen}
          onClose={() => setIsTooltipOpen(false)}
          position="top"
          align="center"
          offset={4}
          trigger={badgeRef}
        >
          <div
            className={cn(
              pressable.alternate,
              text.legal,
              color.foreground,
              border.default,
              border.radius,
              'rounded-md bg-gray-900 px-2 py-1 text-xs text-white whitespace-nowrap',
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {displayText}
          </div>
        </Popover>
      )}
    </div>
  );
}
