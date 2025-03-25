'use client';

import { Address, Avatar, Name } from '@/identity';
import { background, border, cn, pressable } from '@/styles/theme';
import type { SendAddressSelectorProps } from '../types';

export function SendAddressSelector({
  address,
  senderChain,
  onClick,
  classNames,
}: SendAddressSelectorProps) {
  if (!address || !senderChain) {
    return null;
  }

  return (
    <button
      data-testid="ockSendAddressSelector_button"
      type="button"
      onClick={onClick}
      className="w-full text-left"
    >
      <div
        data-testid="ockSendAddressSelector_container"
        className={cn(
          background.default,
          border.radius,
          pressable.default,
          'items-left flex min-w-[300px]',
          'mt-2 p-2',
          classNames?.container,
        )}
      >
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <Avatar
              address={address}
              chain={senderChain}
              className={classNames?.avatar}
            />
          </div>
          <div className="flex flex-col">
            <Name
              address={address}
              chain={senderChain}
              className={classNames?.name}
            />
            <Address
              address={address}
              hasCopyAddressOnClick={false}
              className={classNames?.address}
            />
          </div>
        </div>
      </div>
    </button>
  );
}
