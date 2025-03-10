import { border, cn, color, pressable, text } from '../../styles/theme';
import { useSignatureContext } from './SignatureProvider';
import type { ReactNode } from 'react';

type SignatureButtonProps = {
  className?: string;
  disabled?: boolean;
  label: ReactNode;
}

export function SignatureButton({
  className,
  disabled = false,
  label = "Sign"
}: SignatureButtonProps) {
  const {
    handleSign
  } = useSignatureContext();

  return (
    <button
      className={cn(
        pressable.primary,
        border.radius,
        'w-full rounded-xl',
        'px-4 py-3 font-medium leading-6',
        disabled && pressable.disabled,
        text.headline,
        color.inverse,
        className,
      )}
      type="button"
      onClick={handleSign}
      disabled={disabled}
      data-testid="ockTransactionButton_Button"
    >
      {label}
    </button>
  );
}
