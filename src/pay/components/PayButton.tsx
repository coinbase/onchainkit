import { useContext } from 'react';
import { cn, pressable, text } from '../../styles/theme';
import { usePayContext } from './PayProvider';

export function PayButton() {
  const { handleSubmit } = usePayContext();

  return (
    <button
      className={cn(
        pressable.primary,
        'w-full rounded-xl',
        'mt-4 px-4 py-3 font-medium text-base text-white leading-6',
        text.headline
      )}
      onClick={handleSubmit}
      type="button"
      //   disabled={isDisabled}
    >
      Hello
    </button>
  );
}
