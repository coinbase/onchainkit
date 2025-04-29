import { border, cn, color, pressable, text } from '@/styles/theme';
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
        border.radius,
        text.headline,
        color.inverse,
        'items-center justify-center px-4 py-3',
        className,
      )}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
