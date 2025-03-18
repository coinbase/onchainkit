'use client';
import type { Address, Chain } from 'viem';
import { Address as AddressComponent } from './Address';
import { Avatar } from './Avatar';
import { Badge } from './Badge';
import { Identity } from './Identity';
import { Name } from './Name';
import { Socials } from './Socials';

import { background, border, cn } from '../../styles/theme';

type IdentityCardReact = {
  address?: Address;
  chain?: Chain;
  className?: string;
  schemaId?: Address | null;
  /** Controls whether the badge shows a tooltip on hover. Defaults to false. */
  badgeTooltip?: boolean;
  /** Custom text to display in the badge tooltip. Defaults to the attestation name if not provided. */
  badgeTooltipText?: string;
};

export function IdentityCard({
  address,
  chain,
  className = '',
  schemaId,
  badgeTooltip,
  badgeTooltipText,
}: IdentityCardReact) {
  return (
    <Identity
      address={address}
      chain={chain}
      className={cn(
        border.radius,
        border.lineDefault,
        background.default,
        'items-left flex min-w-[300px] p-4',
        className,
      )}
      schemaId={schemaId}
    >
      <Avatar />
      <Name>
        <Badge tooltip={badgeTooltip} tooltipText={badgeTooltipText} />
      </Name>
      <AddressComponent />
      <Socials />
    </Identity>
  );
}
