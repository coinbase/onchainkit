'use client';

import { TextInput } from '@/internal/components/TextInput';
import { background, border, cn, color } from '@/styles/theme';
import { useCallback } from 'react';
import type { SendAddressInputProps } from '../types';
import { resolveAddressInput } from '../utils/resolveAddressInput';
import { useSendContext } from './SendProvider';

export function SendAddressInput({ classNames }: SendAddressInputProps) {
  const { recipientState, setRecipientState, handleRecipientInputChange } =
    useSendContext();

  const handleFocus = useCallback(() => {
    if (recipientState.address) {
      handleRecipientInputChange();
    }
  }, [recipientState.address, handleRecipientInputChange]);

  const handleSetValue = useCallback(
    (input: string) => {
      setRecipientState((prev) => ({
        ...prev,
        input,
      }));
    },
    [setRecipientState],
  );

  const handleChange = useCallback(
    async (input: string) => {
      const resolvedRecipientState = await resolveAddressInput(input);
      setRecipientState(resolvedRecipientState);
    },
    [setRecipientState],
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
        value={recipientState.displayValue ?? recipientState.input}
        setValue={handleSetValue}
        onChange={handleChange}
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
