'use client';

import { TextInput } from '@/internal/components/TextInput';
import { background, border, cn, color } from '@/styles/theme';
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useMemo,
} from 'react';
import { resolveAddressInput } from '../utils/resolveAddressInput';
import type { RecipientAddress } from '@/wallet/components/WalletAdvancedSend/types';
import { validateAddressInput } from '@/wallet/components/WalletAdvancedSend/utils/validateAddressInput';

type AddressInputProps = {
  selectedRecipientAddress: RecipientAddress;
  recipientInput: string;
  setRecipientInput: Dispatch<SetStateAction<string>>;
  setValidatedInput: Dispatch<SetStateAction<RecipientAddress>>;
  handleRecipientInputChange: () => void;
  className?: string;
};

export function SendAddressInput({
  selectedRecipientAddress,
  recipientInput,
  setRecipientInput,
  setValidatedInput,
  handleRecipientInputChange,
  className,
}: AddressInputProps) {
  const displayValue = useMemo(() => {
    if (selectedRecipientAddress?.display) {
      return selectedRecipientAddress.display;
    }
    return recipientInput;
  }, [selectedRecipientAddress, recipientInput]);

  const handleFocus = useCallback(() => {
    if (selectedRecipientAddress.value) {
      handleRecipientInputChange();
    }
  }, [selectedRecipientAddress, handleRecipientInputChange]);

  const handleSetValue = useCallback(
    async (input: string) => {
      const resolved = await resolveAddressInput(
        selectedRecipientAddress.value,
        input,
      );
      setValidatedInput(resolved);
      setRecipientInput(input);
    },
    [selectedRecipientAddress.value, setValidatedInput, setRecipientInput],
  );

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
      <span className={cn(color.foreground)}>To</span>
      <TextInput
        inputMode="text"
        placeholder="Basename, ENS, or Address"
        value={displayValue}
        inputValidator={() => !!validateAddressInput(recipientInput)}
        setValue={handleSetValue}
        onChange={setRecipientInput}
        onFocus={handleFocus}
        aria-label="Input Receiver Address"
        className={cn(background.default, 'w-full outline-none')}
      />
    </div>
  );
}
