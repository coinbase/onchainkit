'use client';

import { TextInput } from '@/internal/components/TextInput';
import { background, border, cn, color } from '@/styles/theme';
import type { SendAddressInputProps } from '../types';
import { useSendContext } from './SendProvider';

export function SendAddressInput({ classNames }: SendAddressInputProps) {
  const {
    recipientState,
    updateRecipientInput,
    validateRecipientInput,
    deselectRecipient,
  } = useSendContext();

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
        setValue={updateRecipientInput}
        onChange={validateRecipientInput}
        onFocus={deselectRecipient}
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
