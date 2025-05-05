import { cn, pressable, text } from '@/styles/theme';
import { type ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  children,
  className,
  disabled = false,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={cn(
        pressable.primary,
        disabled && pressable.disabled,
        'rounded-ock-default',
        text.headline,
        'text-ock-text-inverse',
        'items-center justify-center px-4 py-3',
        className,
      )}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
