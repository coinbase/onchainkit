import { Address, Avatar, Identity, Name } from '@/identity';
import { useSendContext } from '@/send/components/SendProvider';
import { background, border, cn, pressable } from '@/styles/theme';

export function AddressSelector() {
  const {
    senderChain,
    validatedRecipientAddress,
    handleAddressSelection,
    lifecycleStatus,
  } = useSendContext();

  if (
    !validatedRecipientAddress ||
    lifecycleStatus.statusName !== 'selectingAddress'
  ) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => handleAddressSelection(validatedRecipientAddress)}
      className="text-left"
    >
      <Identity
        address={validatedRecipientAddress}
        chain={senderChain}
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
