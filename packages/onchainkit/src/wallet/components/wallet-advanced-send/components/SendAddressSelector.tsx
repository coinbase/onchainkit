'use client';

import { Address, Avatar, Name } from '@/identity';
import { background, border, cn, pressable } from '@/styles/theme';
import { useWalletContext } from '../../WalletProvider';
import type { SendAddressSelectorProps } from '../types';
import { useSendContext } from './SendProvider';
import { useCallback } from 'react';

export function SendAddressSelector({ classNames }: SendAddressSelectorProps) {
  const { chain } = useWalletContext();
  const { recipientState, handleRecipientSelection } = useSendContext();

  const handleSelectorClick = useCallback(async () => {
    if (!recipientState.address) {
      return;
    }

    handleRecipientSelection({
      phase: 'selected',
      input: recipientState.input,
      address: recipientState.address,
      displayValue: recipientState.displayValue,
    });
  }, [
    recipientState.input,
    recipientState.address,
    recipientState.displayValue,
    handleRecipientSelection,
  ]);

  if (!recipientState.address || !chain) {
    return null;
  }

  return (
    <button
      data-testid="ockSendAddressSelector_button"
      type="button"
      onClick={handleSelectorClick}
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
              address={recipientState.address}
              chain={chain}
              className={classNames?.avatar}
            />
          </div>
          <div className="flex flex-col">
            <Name
              address={recipientState.address}
              chain={chain}
              className={classNames?.name}
            />
            <Address
              address={recipientState.address}
              hasCopyAddressOnClick={false}
              className={classNames?.address}
            />
          </div>
        </div>
      </div>
    </button>
  );
}
