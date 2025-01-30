'use client';

import { TextInput } from '@/internal/components/TextInput';
import { background, border, cn, color } from '@/styles/theme';
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
} from 'react';
import type { Address } from 'viem';
import { resolveAddressInput } from '../utils/resolveAddressInput';

type AddressInputProps = {
  selectedRecipientAddress: Address | null;
  recipientInput: string | null;
  setRecipientInput: Dispatch<SetStateAction<string | null>>;
  handleRecipientInputChange: (input: string) => void;
  className?: string;
};

export function SendAddressInput({
  selectedRecipientAddress,
  recipientInput,
  setRecipientInput,
  handleRecipientInputChange,
  className,
}: AddressInputProps) {
  useEffect(() => {
    resolveAddressInput(selectedRecipientAddress, recipientInput)
      .then(setRecipientInput)
      .catch(console.error);
  }, [selectedRecipientAddress, recipientInput, setRecipientInput]);

  const handleFocus = useCallback(() => {
    if (selectedRecipientAddress) {
      resolveAddressInput(selectedRecipientAddress, recipientInput)
        .then((value) => handleRecipientInputChange(value ?? ''))
        .catch(console.error);
    }
  }, [selectedRecipientAddress, handleRecipientInputChange, recipientInput]);

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
        value={recipientInput ?? ''}
        onChange={handleRecipientInputChange}
        onFocus={handleFocus}
        aria-label="Input Receiver Address"
        className={cn(background.default, 'w-full outline-none')}
      />
    </div>
  );
}
