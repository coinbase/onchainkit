'use client';

import { getName } from '@/identity';
import { getSlicedAddress } from '@/identity/utils/getSlicedAddress';
import { TextInput } from '@/internal/components/TextInput';
import { background, border, cn, color } from '@/styles/theme';
import { useCallback, useEffect, useState } from 'react';
import type { Address, Chain } from 'viem';
import { base } from 'viem/chains';

type AddressInputProps = {
  selectedRecipientAddress: Address | null;
  recipientInput: string | null;
  handleRecipientInputChange: (input: string) => void;
  senderChain: Chain | null | undefined;
  className?: string;
};

export function SendAddressInput({
  selectedRecipientAddress,
  recipientInput,
  handleRecipientInputChange,
  senderChain,
  className,
}: AddressInputProps) {
  const [inputValue, setInputValue] = useState<string | null>(null);

  useEffect(() => {
    getInputValue(selectedRecipientAddress, recipientInput, senderChain)
      .then(setInputValue)
      .catch(console.error);
  }, [selectedRecipientAddress, recipientInput, senderChain]);

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (selectedRecipientAddress) {
        getInputValue(selectedRecipientAddress, recipientInput, senderChain)
          .then((value) => handleRecipientInputChange(value ?? ''))
          .catch(console.error);
        setTimeout(() => {
          // TODO: This is a hack to get the cursor to the end of the input, how to remove timeout?
          e.target.setSelectionRange(
            selectedRecipientAddress.length,
            selectedRecipientAddress.length,
          );
          e.target.scrollLeft = e.target.scrollWidth;
        }, 0);
      }
    },
    [
      selectedRecipientAddress,
      handleRecipientInputChange,
      recipientInput,
      senderChain,
    ],
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
        value={inputValue ?? ''}
        onChange={handleRecipientInputChange}
        onFocus={handleFocus}
        aria-label="Input Receiver Address"
        className={cn(background.default, 'w-full outline-none')}
      />
    </div>
  );
}

async function getInputValue(
  selectedRecipientAddress: Address | null,
  recipientInput: string | null,
  senderChain: Chain | null | undefined,
) {
  if (!selectedRecipientAddress) {
    return recipientInput;
  }

  const name = await getName({
    address: selectedRecipientAddress,
    chain: senderChain ?? base,
  });
  if (name) {
    return name;
  }

  return getSlicedAddress(selectedRecipientAddress);
}
