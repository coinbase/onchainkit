'use client';
import { useAttestations } from '@/identity/hooks/useAttestations';
import type { BadgeReact } from '@/identity/types';
import { badgeSvg } from '@/internal/svg/badgeSvg';
import { zIndex } from '@/styles/constants';
import { background, border, cn, color, pressable, text } from '@/styles/theme';
import { useMemo, useState } from 'react';
import { useOnchainKit } from '../../useOnchainKit';
import { useIdentityContext } from './IdentityProvider';

type ExtractAttestationNameParams = {
  decodedDataJson?: string;
  id?: string;
  attester?: string;
  expirationTime?: number;
  recipient?: string;
  revocationTime?: number;
  revoked?: boolean;
  schemaId?: string;
  time?: number;
};

/**
 * Badge component.
 */
export function Badge({ className, tooltip = false }: BadgeReact) {
  const [showTooltip, setShowTooltip] = useState(false);
  const { address, schemaId: contextSchemaId } = useIdentityContext();
  const { chain, schemaId: kitSchemaId } = useOnchainKit();

  const attestations = useAttestations({
    address,
    chain,
    schemaId: tooltip ? (contextSchemaId ?? kitSchemaId) : null,
  });

  // Get tooltip text from tooltip prop or attestation
  const displayText = useMemo(() => {
    if (!tooltip) {
      return null;
    }

    return typeof tooltip === 'string'
      ? tooltip
      : extractAttestationName(attestations[0]);
  }, [tooltip, attestations]);

  const badgeSize = '12px';

  return (
    <div className="relative inline-flex" data-testid="ockBadgeContainer">
      <span
        className={cn(
          background.primary,
          border.default,
          border.radius,
          tooltip && 'cursor-pointer',
          className,
        )}
        style={{
          height: badgeSize,
          width: badgeSize,
          maxHeight: badgeSize,
          maxWidth: badgeSize,
        }}
        data-testid="ockBadge"
        {...(tooltip && {
          onMouseEnter: () => setShowTooltip(true),
          onMouseLeave: () => setShowTooltip(false),
        })}
      >
        {badgeSvg}
      </span>
      {showTooltip && tooltip && (
        <div
          className={cn(
            border.radius,
            border.default,
            pressable.alternate,
            text.legal,
            color.foreground,
            zIndex.tooltip,
            '-translate-x-1/2 absolute bottom-full left-1/2 mb-1 transform',
            'whitespace-nowrap px-1.5 py-0.5',
          )}
          data-testid="ockBadgeTooltip"
        >
          {displayText}
          <div
            className={cn(
              '-translate-x-1/2 absolute top-full left-1/2 transform',
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
function extractAttestationName(
  attestation?: ExtractAttestationNameParams,
): string {
  if (!attestation?.decodedDataJson) {
    return 'Verified';
  }

  try {
    const decodedData = JSON.parse(attestation.decodedDataJson);

    if (Array.isArray(decodedData) && decodedData[0]?.name) {
      return decodedData[0].name;
    }

    const value = Object.values(decodedData)[0];

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
