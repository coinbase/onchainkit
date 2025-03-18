'use client';
import { useAttestations } from '@/identity/hooks/useAttestations';
import type { BadgeReact } from '@/identity/types';
import { badgeSvg } from '@/internal/svg/badgeSvg';
import { zIndex } from '@/styles/constants';
import { background, border, cn, color, pressable, text } from '@/styles/theme';
import { useState } from 'react';
import { useOnchainKit } from '../../useOnchainKit';
import { useIdentityContext } from './IdentityProvider';

/**
 * Badge component.
 */
export function Badge({ className, tooltip = false, tooltipText }: BadgeReact) {
  const [showTooltip, setShowTooltip] = useState(false);
  const { address, schemaId: contextSchemaId } = useIdentityContext();
  const { chain, schemaId: kitSchemaId } = useOnchainKit();

  // If tooltipText is provided, tooltip should be enabled
  const showTooltipFeature = tooltipText ? true : tooltip;

  const attestations = useAttestations({
    address,
    chain,
    schemaId: contextSchemaId ?? kitSchemaId,
  });

  // Extract displayText from attestation or use default
  const displayText = tooltipText ?? extractAttestationName(attestations[0]);

  const badgeSize = '12px';

  return (
    <div className="relative inline-flex" data-testid="ockBadgeContainer">
      <span
        className={cn(
          background.primary,
          border.default,
          border.radius,
          showTooltipFeature && 'cursor-pointer',
          className,
        )}
        style={{
          height: badgeSize,
          width: badgeSize,
          maxHeight: badgeSize,
          maxWidth: badgeSize,
        }}
        data-testid="ockBadge"
        {...(showTooltipFeature && {
          onMouseEnter: () => setShowTooltip(true),
          onMouseLeave: () => setShowTooltip(false),
        })}
      >
        {badgeSvg}
      </span>
      {showTooltip && showTooltipFeature && (
        <div
          className={cn(
            border.radius,
            border.default,
            pressable.alternate,
            text.legal,
            color.foreground,
            zIndex.tooltip,
            'absolute bottom-full left-1/2 mb-1 -translate-x-1/2 transform',
            'whitespace-nowrap px-1.5 py-0.5',
          )}
          data-testid="ockBadgeTooltip"
        >
          {displayText}
          <div
            className={cn(
              'absolute left-1/2 top-full -translate-x-1/2 transform',
            )}
          />
        </div>
      )}
    </div>
  );
}

/**
 * Extracts the attestation name from an attestation object
 */
function extractAttestationName(attestation?: any): string {
  if (!attestation?.decodedDataJson) {
    return 'Verified';
  }

  try {
    const decodedData = JSON.parse(attestation.decodedDataJson);

    if (Array.isArray(decodedData) && decodedData[0]?.name) {
      return decodedData[0].name;
    }

    const firstKey = Object.keys(decodedData)[0];
    const value = decodedData[firstKey];

    if (typeof value === 'string') {
      return value;
    }

    if (
      value &&
      typeof value === 'object' &&
      'value' in value &&
      typeof value.value === 'string'
    ) {
      return value.value;
    }
  } catch {
    // If parsing fails, return default
  }

  return 'Verified';
}
