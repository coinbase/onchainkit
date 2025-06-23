import { prefixStringParts } from '@/utils/prefixStringParts';
import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  prefix: 'ock',
  extend: {
    theme: {
      font: ['ock'],
      radius: ['ock-default', 'ock-inner'],
      shadow: ['ock-default'],
      color: [
        'ock-text-inverse',
        'ock-text-foreground',
        'ock-text-foreground-muted',
        'ock-text-error',
        'ock-text-primary',
        'ock-text-success',
        'ock-text-warning',
        'ock-text-disabled',
        'ock-bg-default',
        'ock-bg-default-hover',
        'ock-bg-default-active',
        'ock-bg-alternate',
        'ock-bg-alternate-hover',
        'ock-bg-alternate-active',
        'ock-bg-inverse',
        'ock-bg-inverse-hover',
        'ock-bg-inverse-active',
        'ock-bg-primary',
        'ock-bg-primary-hover',
        'ock-bg-primary-active',
        'ock-bg-primary-washed',
        'ock-bg-primary-disabled',
        'ock-bg-secondary',
        'ock-bg-secondary-hover',
        'ock-bg-secondary-active',
        'ock-bg-error',
        'ock-bg-warning',
        'ock-bg-success',
        'ock-bg-default-reverse',
        'ock-icon-color-primary',
        'ock-icon-color-foreground',
        'ock-icon-color-foreground-muted',
        'ock-icon-color-inverse',
        'ock-icon-color-error',
        'ock-icon-color-success',
        'ock-icon-color-warning',
        'ock-line-primary',
        'ock-line-default',
        'ock-line-heavy',
        'ock-line-inverse',
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const prefixClassName = (className: string) => {
  if (typeof __CLASSNAME_PREFIX__ === 'undefined') {
    throw new Error('__CLASSNAME_PREFIX__ is not defined');
  }
  return prefixStringParts(className, __CLASSNAME_PREFIX__);
};

export const text = {
  base: prefixClassName('font-ock'),
  body: prefixClassName('font-ock font-normal text-base'),
  caption: prefixClassName('font-ock font-semibold text-xs'),
  headline: prefixClassName('font-ock font-semibold'),
  label1: prefixClassName('font-ock font-semibold text-sm'),
  label2: prefixClassName('font-ock text-sm'),
  legal: prefixClassName('font-ock text-xs'),
  title1: prefixClassName('font-ock font-semibold text-2xl'),
  title3: prefixClassName('font-ock font-semibold text-xl'),
} as const;

export const pressable = {
  default: prefixClassName(
    `cursor-pointer bg-ock-bg-default hover:bg-ock-bg-default-hover active:bg-ock-bg-default-active focus:bg-ock-bg-default-active`,
  ),
  alternate: prefixClassName(
    `cursor-pointer bg-ock-bg-alternate hover:bg-ock-bg-alternate-hover active:bg-ock-bg-alternate-active focus:bg-ock-bg-alternate-active`,
  ),
  inverse: prefixClassName(
    `cursor-pointer bg-ock-bg-inverse hover:bg-ock-bg-inverse-hover active:bg-ock-bg-inverse-active focus:bg-ock-bg-inverse-active`,
  ),
  primary: prefixClassName(
    `cursor-pointer bg-ock-bg-primary hover:bg-ock-bg-primary-hover active:bg-ock-bg-primary-active focus:bg-ock-bg-primary-active`,
  ),
  secondary: prefixClassName(
    `cursor-pointer bg-ock-bg-secondary hover:bg-ock-bg-secondary-hover active:bg-ock-bg-secondary-active focus:bg-ock-bg-secondary-active`,
  ),
  coinbaseBranding: prefixClassName(
    'cursor-pointer bg-[#0052FF] hover:bg-[#0045D8]',
  ),
  disabled: prefixClassName('opacity-[0.38] pointer-events-none'),
} as const;

export const border = {
  linePrimary: prefixClassName('border-ock-line-primary border'),
  lineDefault: prefixClassName('border-ock-line-default border'),
  lineHeavy: prefixClassName('border-ock-line-heavy border'),
  lineInverse: prefixClassName('border-ock-line-inverse border'),
} as const;
