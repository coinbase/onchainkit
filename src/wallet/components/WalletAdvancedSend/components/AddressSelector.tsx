import { Address, Avatar, Identity, Name } from '@/identity';
import { useSendContext } from '@/wallet/components/WalletAdvancedSend/components/SendProvider';
import { background, border, cn, pressable } from '@/styles/theme';
import { useCallback } from 'react';
import type { Address as AddressType } from 'viem';

type AddressSelectorProps = {
  address: AddressType;
};

export function AddressSelector({ address }: AddressSelectorProps) {
  const { senderChain, handleAddressSelection } = useSendContext();

  const handleClick = useCallback(() => {
    handleAddressSelection(address);
  }, [handleAddressSelection, address]);

  return (
    <button type="button" onClick={handleClick} className="text-left">
      <Identity
        address={address}
        chain={senderChain || undefined}
        hasCopyAddressOnClick={false}
        className={cn(
          background.default,
          border.radius,
          pressable.default,
          'items-left flex min-w-[300px] p-2',
        )}
      >
        <Avatar />
        <Name />
        <Address />
      </Identity>
    </button>
  );
}
