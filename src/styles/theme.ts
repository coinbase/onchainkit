import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* size, weight, leading, tracking */
export const text = {
  body: 'font-family font-sans ock-text-foreground font-semibold leading-normal',
  caption:
    'ock-font-family font-sans ock-text-foreground text-bold text-xs leading-4',
  headline:
    'ock-font-family font-semibold ock-text-foreground font-sans leading-normal',
  label1:
    'ock-font-family font-semibold ock-text-foreground font-sans text-sm leading-5',
  label2: 'ock-font-family font-sans ock-text-foreground text-sm leading-5',
  legal: 'ock-font-family font-sans ock-text-foreground text-xs leading-4',
  title3:
    'ock-font-family font-semibold ock-text-foreground font-display text-xl leading-7',
} as const;

export const pressable = {
  default:
    'cursor-pointer ock-bg-default active:ock-bg-default-active hover:bg-[var(--ock-bg-default-hover)]',
  alternate:
    'cursor-pointer ock-bg-alternate active:ock-bg-alternate-active hover:[var(--ock-bg-alternate-hover)]',
  inverse:
    'cursor-pointer ock-bg-inverse active:ock-bg-inverse-active hover:bg-[var(--ock-bg-inverse-hover)]',
  primary:
    'cursor-pointer ock-bg-primary active:ock-bg-primary-active hover:bg-[var(--ock-bg-primary-hover)]',
  secondary:
    'cursor-pointer ock-bg-secondary active:ock-bg-secondary-active hover:bg-[var(--ock-bg-secondary-hover)]',
  coinbaseBranding:
    'cursor-pointer bg-[#0052FF] active:ock-bg-secondary-active hover:bg-[#0045D8]',
  shadow: 'ock-shadow-default',
  disabled: 'opacity-[0.38] pointer-events-none',
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
  washed: 'ock-bg-primary-washed',
  disabled: 'ock-bg-primary-disabled',
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
  default: 'ock-fill-default',
  defaultReverse: 'ock-fill-default-reverse',
  inverse: 'ock-fill-inverse',
} as const;

export const border = {
  default: 'ock-border-default',
  defaultActive: 'ock-border-default-active',
  radius: 'ock-border-radius',
} as const;

export const placeholder = {
  default: 'ock-placeholder-default',
} as const;
