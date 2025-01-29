'use client';

import { getName, isBasename } from '@/identity';
import { getSlicedAddress } from '@/identity/utils/getSlicedAddress';
import { TextInput } from '@/internal/components/TextInput';
import { background, border, cn, color } from '@/styles/theme';
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
} from 'react';
import type { Address } from 'viem';
import { base, mainnet } from 'viem/chains';

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
    resolveInputDisplay(selectedRecipientAddress, recipientInput)
      .then(setRecipientInput)
      .catch(console.error);
  }, [selectedRecipientAddress, recipientInput, setRecipientInput]);

  const handleFocus = useCallback(() => {
    if (selectedRecipientAddress) {
      resolveInputDisplay(selectedRecipientAddress, recipientInput)
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

async function resolveInputDisplay(
  selectedRecipientAddress: Address | null,
  recipientInput: string | null,
) {
  if (!recipientInput) {
    return null;
  }

  if (!selectedRecipientAddress) {
    return recipientInput;
  }

  const name = await getName({
    address: selectedRecipientAddress,
    chain: isBasename(recipientInput) ? base : mainnet,
  });
  if (name) {
    return name;
  }

  return getSlicedAddress(selectedRecipientAddress);
}
