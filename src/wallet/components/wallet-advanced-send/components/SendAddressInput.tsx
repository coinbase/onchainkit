'use client';

import { TextInput } from '@/internal/components/TextInput';
import { background, border, cn, color } from '@/styles/theme';
import { useCallback } from 'react';
import type { SendAddressInputProps } from '../types';
import { resolveAddressInput } from '../utils/resolveAddressInput';
import { validateAddressInput } from '../utils/validateAddressInput';

export function SendAddressInput({
  selectedRecipient,
  recipientInput,
  setRecipientInput,
  setValidatedInput,
  handleRecipientInputChange,
  classNames,
}: SendAddressInputProps) {
  const displayValue = selectedRecipient?.displayValue || recipientInput;

  const handleFocus = useCallback(() => {
    if (selectedRecipient.address) {
      handleRecipientInputChange();
    }
  }, [selectedRecipient, handleRecipientInputChange]);

  const handleSetValue = useCallback(
    async (input: string) => {
      const resolved = await resolveAddressInput(
        selectedRecipient.address,
        input,
      );
      setValidatedInput(resolved);
    },
    [selectedRecipient.address, setValidatedInput],
  );

  const validateInput = useCallback(
    (recipientInput: string) => !!validateAddressInput(recipientInput),
    [],
  );

  return (
    <div
      data-testid="ockSendAddressInput"
      className={cn(
        border.lineDefault,
        border.radius,
        'w-full',
        'flex items-center gap-2',
        'px-4 py-3',
        classNames?.container,
      )}
    >
      <span className={cn(color.foreground, classNames?.label)}>To</span>
      <TextInput
        inputMode="text"
        placeholder="Basename, ENS, or Address"
        value={displayValue}
        inputValidator={validateInput}
        setValue={setRecipientInput}
        onChange={handleSetValue}
        onFocus={handleFocus}
        aria-label="Input Receiver Address"
        className={cn(
          background.default,
          'w-full outline-none',
          classNames?.input,
        )}
      />
    </div>
  );
}
