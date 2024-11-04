import type { Address, Chain } from 'viem';
import { Address as AddressComponent } from './Address';
import { Avatar } from './Avatar';
import { Identity } from './Identity';
import { Name } from './Name';
import { Socials } from './Socials';

import { background, border, cn, line } from '../../styles/theme';

type IdentityCardReact = {
  address?: Address;
  chain?: Chain;
  className?: string;
};

export function IdentityCard({
  address,
  chain,
  className = '',
}: IdentityCardReact) {
  return (
    <Identity
      address={address}
      chain={chain}
      className={cn(
        border.radius,
        background.default,
        line.default,
        'items-left flex min-w-[300px] p-4',
        className,
      )}
    >
      <Avatar />
      <Name />
      <AddressComponent />
      <Socials />
    </Identity>
  );
}
