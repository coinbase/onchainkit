import { prefixStringParts } from '@/utils/prefixStringParts';
import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  prefix: 'ock:',
  extend: {
    theme: {
      font: ['ock'],
      radius: ['default', 'inner'],
      shadow: ['default'],
      color: [
        'foreground',
        'foreground-muted',
        'foreground-inverse',
        'foreground-disabled',
        'background',
        'background-hover',
        'background-active',
        'background-alternate',
        'background-alternate-hover',
        'background-alternate-active',
        'background-inverse',
        'background-inverse-hover',
        'background-inverse-active',
        'background-reverse',
        'primary',
        'primary-hover',
        'primary-active',
        'primary-washed',
        'primary-disabled',
        'secondary',
        'secondary-hover',
        'secondary-active',
        'error',
        'warning',
        'success',
        'success-background',
        'border',
        'border-heavy',
        'border-inverse',
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
    `cursor-pointer bg-background hover:bg-background-hover active:bg-background-active focus:bg-background-active`,
  ),
  alternate: prefixClassName(
    `cursor-pointer bg-background-alternate hover:bg-background-alternate-hover active:bg-background-alternate-active focus:bg-background-alternate-active`,
  ),
  inverse: prefixClassName(
    `cursor-pointer bg-background-inverse hover:bg-background-inverse-hover active:bg-background-inverse-active focus:bg-background-inverse-active`,
  ),
  primary: prefixClassName(
    `cursor-pointer bg-primary hover:bg-primary-hover active:bg-primary-active focus:bg-primary-active`,
  ),
  secondary: prefixClassName(
    `cursor-pointer bg-secondary hover:bg-secondary-hover active:bg-secondary-active focus:bg-secondary-active`,
  ),
  coinbaseBranding: prefixClassName(
    'cursor-pointer bg-[#0052FF] hover:bg-[#0045D8]',
  ),
  disabled: prefixClassName('opacity-[0.38] pointer-events-none'),
} as const;

export const border = {
  linePrimary: prefixClassName('border-primary border'),
  lineDefault: prefixClassName('border-border border'),
  lineHeavy: prefixClassName('border-border-heavy border'),
  lineInverse: prefixClassName('border-border-inverse border'),
} as const;
