import { TextInput } from '@/internal/components/TextInput';
import { background, border, cn, color } from '@/styles/theme';
import type { Dispatch, SetStateAction } from 'react';

type AddressInputProps = {
  addressInput: string | null;
  setAddressInput: Dispatch<SetStateAction<string | null>>;
  className?: string;
};

export function AddressInput({
  addressInput,
  setAddressInput,
  className,
}: AddressInputProps) {
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
        value={addressInput ?? ''}
        onChange={setAddressInput}
        aria-label="Input Receiver Address"
        className={cn(background.default, 'w-full outline-none')}
      />
    </div>
  );
}
