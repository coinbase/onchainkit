import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const text = {
  body: 'font-sans text-ock-foreground text-base leading-normal',
  caption: 'font-sans text-ock-foreground text-bold text-xs leading-4',
  headline: 'font-bold text-ock-foreground font-sans text-base leading-normal',
  label1: 'font-bold text-ock-foreground font-sans text-sm leading-5',
  label2: 'font-sans text-ock-foreground text-sm leading-5',
  legal: 'font-sans text-ock-foreground text-xs leading-4',
  title3: 'font-bold text-ock-foreground font-display text-xl leading-7',
} as const;

export const pressable = {
  default:
    'cursor-pointer bg-ock-default active:bg-ock-default-active hover:bg-[var(--bg-ock-default-hover)]',
  alternate:
    'cursor-pointer bg-ock-alternate active:bg-ock-alternate-active hover:[var(--bg-ock-alternate-hover)]',
  inverse:
    'cursor-pointer bg-ock-inverse active:bg-ock-inverse-active hover:bg-[var(--bg-ock-inverse-hover)]',
  primary:
    'cursor-pointer bg-ock-primary active:bg-ock-primary-active hover:bg-[var(--bg-ock-primary-hover)]',
  secondary:
    'cursor-pointer bg-ock-secondary active:bg-ock-secondary-active hover:bg-[var(--bg-ock-secondary-hover)]',
  coinbaseBranding:
    'cursor-pointer bg-[#0052FF] active:bg-ock-secondary-active hover:bg-[#0045D8]',
  shadow: 'shadow-ock-default',
  disabled: 'opacity-[0.38]',
} as const;

export const background = {
  default: 'bg-ock-default',
  alternate: 'bg-ock-alternate',
  inverse: 'bg-ock-inverse',
  primary: 'bg-ock-primary',
  secondary: 'bg-ock-secondary',
  error: 'bg-ock-error',
  warning: 'bg-ock-warning',
  success: 'bg-ock-success',
} as const;

export const color = {
  inverse: 'text-ock-inverse',
  foreground: 'text-ock-foreground',
  foregroundMuted: 'text-ock-foreground-muted',
  error: 'text-ock-error',
  primary: 'text-ock-primary',
  success: 'text-ock-success',
  warning: 'text-ock-warning',
  disabled: 'text-ock-disabled',
} as const;

export const fill = {
  defaultReverse: 'fill-ock-default-reverse',
  inverse: 'fill-ock-inverse',
} as const;

export const border = {
  default: 'border-ock-default',
  defaultActive: 'border-ock-default-active',
} as const;

export const placeholder = {
  default: 'placeholder-ock-default',
} as const;
