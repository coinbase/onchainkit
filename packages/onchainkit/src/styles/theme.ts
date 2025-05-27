import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const text = {
  base: 'font-ock',
  body: 'font-ock font-normal text-base',
  caption: 'font-ock font-semibold text-xs',
  headline: 'font-ock font-semibold',
  label1: 'font-ock font-semibold text-sm',
  label2: 'font-ock text-sm',
  legal: 'font-ock text-xs',
  title1: 'font-ock font-semibold text-2xl',
  title3: 'font-ock font-semibold text-xl',
} as const;

export const pressable = {
  default: `cursor-pointer bg-ock-bg-default hover:bg-ock-bg-default-hover active:bg-ock-bg-default-active`,
  alternate: `cursor-pointer bg-ock-bg-alternate hover:bg-ock-bg-alternate-hover active:bg-ock-bg-alternate-active`,
  inverse: `cursor-pointer bg-ock-bg-inverse hover:bg-ock-bg-inverse-hover active:bg-ock-bg-inverse-active`,
  primary: `cursor-pointer bg-ock-bg-primary hover:bg-ock-bg-primary-hover active:bg-ock-bg-primary-active`,
  secondary: `cursor-pointer bg-ock-bg-secondary hover:bg-ock-bg-secondary-hover active:bg-ock-bg-secondary-active`,
  coinbaseBranding: 'cursor-pointer bg-[#0052FF] hover:bg-[#0045D8]',
  disabled: 'opacity-[0.38] pointer-events-none',
} as const;

export const border = {
  linePrimary: 'border-ock-line-primary border',
  lineDefault: 'border-ock-line-default border',
  lineHeavy: 'border-ock-line-heavy border',
  lineInverse: 'border-ock-line-inverse border',
} as const;
