import { TextInput } from '@/internal/components/TextInput';
import { useSendContext } from '@/send/components/SendProvider';
import { border, cn, color } from '@/styles/theme';

/***
  delayMs?: number;
  disabled?: boolean;
  onBlur?: () => void;
  inputValidator?: (s: string) => boolean;
};
 */

export function AddressInput() {
  const { recipientInput, setRecipientInput } = useSendContext();

  return (
    <div
      className={cn(
        border.lineDefault,
        border.radius,
        'w-full',
        'flex items-center gap-2',
        'px-4 py-3',
      )}
    >
      <span className={cn(color.foregroundMuted)}>To</span>
      <TextInput
        inputMode="text"
        placeholder="Basename, ENS, or Address"
        aria-label="Input Receiver Address"
        value={recipientInput ?? ''}
        onChange={setRecipientInput}
        className="w-full outline-none"
      />
    </div>
  );
}
