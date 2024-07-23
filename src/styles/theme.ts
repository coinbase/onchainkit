import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const text = {
  body: 'font-sans ock-text-foreground text-base leading-normal',
  caption: 'font-sans ock-text-foreground text-bold text-xs leading-4',
  headline: 'font-bold ock-text-foreground font-sans text-base leading-normal',
  label1: 'font-bold ock-text-foreground font-sans text-sm leading-5',
  label2: 'font-sans ock-text-foreground text-sm leading-5',
  legal: 'font-sans ock-text-foreground text-xs leading-4',
  title3: 'font-bold ock-text-foreground font-display text-xl leading-7',
} as const;

export const pressable = {
  default:
    'cursor-pointer ock-bg-default active:ock-bg-default-active hover:ock-bg-default-hover',
  alternate:
    'cursor-pointer ock-bg-alternate active:ock-bg-alternate-active hover:ock-bg-alternate-hover',
  inverse:
    'cursor-pointer ock-bg-inverse active:ock-bg-inverse-active hover:ock-bg-inverse-hover',
  primary:
    'cursor-pointer ock-bg-primary active:ock-bg-primary-active hover:ock-bg-primary-hover',
  secondary:
    'cursor-pointer ock-bg-secondary active:ock-bg-secondary-active hover:ock-bg-secondary-hover',
  shadow: 'shadow-[0px_8px_12px_0px_#5B616E1F]',
  disabled: 'opacity-[0.38]',
} as const;

export const background = {
  default: 'ock-bg-default',
  alternate: 'ock-bg-alternate',
  inverse: 'ock-bg-inverse',
  primary: 'ock-bg-primary',
  secondary: 'ock-bg-secondary',
  error: 'ock-bg-error',
  warning: 'ock-bg-warning',
  success: 'ock-bg-success',
} as const;

export const color = {
  inverse: 'ock-text-inverse',
  foreground: 'ock-text-foreground',
  foregroundMuted: 'ock-text-foreground-muted',
  error: 'ock-text-error',
  primary: 'ock-text-primary',
  success: 'ock-text-success',
  warning: 'ock-text-warning',
  disabled: 'ock-text-disabled',
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
