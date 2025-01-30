'use client';

import { Address, Avatar, Name } from '@/identity';
import { background, border, cn, pressable } from '@/styles/theme';
import type { Address as AddressType, Chain } from 'viem';

type SendAddressSelectorProps = {
  address: AddressType | null;
  senderChain: Chain | null | undefined;
  handleClick: () => Promise<void>;
};

export function SendAddressSelector({
  address,
  senderChain,
  handleClick,
}: SendAddressSelectorProps) {
  if (!address || !senderChain) {
    return null;
  }

  return (
    <button type="button" onClick={handleClick} className="text-left">
      <div
        className={cn(
          background.default,
          border.radius,
          pressable.default,
          'items-left flex min-w-[300px]',
          'mt-2 p-2',
        )}
        data-testid="ockSendAddressSelector_container"
      >
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <Avatar address={address} chain={senderChain} />
          </div>
          <div className="flex flex-col">
            <Name address={address} chain={senderChain} />
            <Address address={address} hasCopyAddressOnClick={false} />
          </div>
        </div>
      </div>
    </button>
  );
}
