import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const text = {
  body: 'font-sans text-foreground text-base leading-normal',
  caption: 'font-sans text-foreground text-bold text-xs leading-4',
  headline: 'font-bold text-foreground font-sans text-base leading-normal',
  label1: 'font-bold text-foreground font-sans text-sm leading-5',
  label2: 'font-sans text-foreground text-sm leading-5',
  legal: 'font-sans text-foreground text-xs leading-4',
  title3: 'font-bold text-foreground font-display text-xl leading-7',
} as const;

export const pressable = {
  default:
    'cursor-pointer bg-default active:bg-default-active hover:bg-default-hover',
  alternate:
    'cursor-pointer bg-alternate active:bg-alternate-active hover:bg-alternate-hover',
  inverse:
    'cursor-pointer bg-inverse active:bg-inverse-active hover:bg-inverse-hover',
  primary:
    'cursor-pointer bg-primary active:bg-primary-active hover:bg-primary-hover',
  secondary:
    'cursor-pointer bg-secondary active:bg-secondary-active hover:bg-secondary-hover',
  shadow: 'shadow-[0px_8px_12px_0px_#5B616E1F]',
  disabled: 'opacity-[0.38]',
} as const;

export const background = {
  default: 'bg-default',
  alternate: 'bg-alternate',
  inverse: 'bg-inverse',
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  error: 'bg-error',
  warning: 'bg-warning',
  success: 'bg-success',
} as const;

export const color = {
  inverse: 'text-inverse',
  foreground: 'text-foreground',
  foregroundMuted: 'text-foreground-muted',
  error: 'text-error',
  primary: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  disabled: 'text-disabled',
} as const;

export const fill = {
  inverse: 'fill-inverse',
  foreground: 'fill-foreground',
  foregroundMuted: 'fill-foreground-muted',
  error: 'fill-error',
  primary: 'fill-primary',
  success: 'fill-success',
  warning: 'fill-warning',
  disabled: 'fill-disabled',
} as const;
