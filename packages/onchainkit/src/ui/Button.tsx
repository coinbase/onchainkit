import { type ButtonHTMLAttributes } from 'react';
import { cn, pressable, text } from '@/styles/theme';

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
        'rounded-default',
        text.headline,
        'text-foreground-inverse',
        'items-center justify-center px-4 py-3',
        className,
      )}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
