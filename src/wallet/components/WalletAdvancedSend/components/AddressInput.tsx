import { getSlicedAddress } from '@/identity/utils/getSlicedAddress';
import { TextInput } from '@/internal/components/TextInput';
import { background, border, cn, color } from '@/styles/theme';
import { useSendContext } from '@/wallet/components/WalletAdvancedSend/components/SendProvider';
import { useCallback } from 'react';

type AddressInputProps = {
  className?: string;
};

export function AddressInput({ className }: AddressInputProps) {
  const {
    selectedRecipientAddress,
    setSelectedRecipientAddress,
    setValidatedRecipientAddress,
    recipientInput,
    setRecipientInput,
  } = useSendContext();

  const inputValue = selectedRecipientAddress
    ? getSlicedAddress(selectedRecipientAddress)
    : recipientInput;

  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    if (selectedRecipientAddress) {
      setRecipientInput(selectedRecipientAddress);
      setTimeout(() => {
        // TODO: This is a hack to get the cursor to the end of the input, how to remove timeout?
        e.target.setSelectionRange(selectedRecipientAddress.length, selectedRecipientAddress.length);
        e.target.scrollLeft = e.target.scrollWidth;

      }, 0);
      setSelectedRecipientAddress(null);
      setValidatedRecipientAddress(null);
    }
  }, [
    selectedRecipientAddress,
    setSelectedRecipientAddress,
    setValidatedRecipientAddress,
    setRecipientInput,
  ]);

  return (
    <div
      className={cn(
        border.lineDefault,
        border.radius,
        'w-full',
        'flex items-center gap-2',
        'px-4 py-3',
        className,
      )}
    >
      <span className={cn(color.foregroundMuted)}>To</span>
      <TextInput
        inputMode="text"
        placeholder="Basename, ENS, or Address"
        value={inputValue ?? ''}
        onChange={setRecipientInput}
        onFocus={handleFocus}
        aria-label="Input Receiver Address"
        className={cn(background.default, 'w-full outline-none')}
      />
    </div>
  );
}
