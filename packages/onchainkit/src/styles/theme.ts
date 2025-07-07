import { prefixStringParts } from '@/utils/prefixStringParts';
import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  prefix: 'ock',
  extend: {
    theme: {
      color: [
        'ock-foreground',
        'ock-foreground-muted',
        'ock-foreground-inverse',
        'ock-foreground-disabled',
        'ock-background',
        'ock-background-hover',
        'ock-background-active',
        'ock-background-alternate',
        'ock-background-alternate-hover',
        'ock-background-alternate-active',
        'ock-background-inverse',
        'ock-background-inverse-hover',
        'ock-background-inverse-active',
        'ock-background-reverse',
        'ock-primary',
        'ock-primary-hover',
        'ock-primary-active',
        'ock-primary-washed',
        'ock-primary-disabled',
        'ock-secondary',
        'ock-secondary-hover',
        'ock-secondary-active',
        'ock-error',
        'ock-warning',
        'ock-success',
        'ock-success-background',
        'ock-line',
      ],
    },
    classGroups: {
      shadow: ['ock-default'],
      'font-family': ['ock'],
      rounded: ['ock-default', 'ock-inner'],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const prefixClassName = (className: string) => {
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
    `cursor-pointer bg-ock-background hover:bg-ock-background-hover active:bg-ock-background-active focus:bg-ock-background-active`,
  ),
  alternate: prefixClassName(
    `cursor-pointer bg-ock-background-alternate hover:bg-ock-background-alternate-hover active:bg-ock-background-alternate-active focus:bg-ock-background-alternate-active`,
  ),
  inverse: prefixClassName(
    `cursor-pointer bg-ock-background-inverse hover:bg-ock-background-inverse-hover active:bg-ock-background-inverse-active focus:bg-ock-background-inverse-active`,
  ),
  primary: prefixClassName(
    `cursor-pointer bg-ock-primary hover:bg-ock-primary-hover active:bg-ock-primary-active focus:bg-ock-primary-active`,
  ),
  secondary: prefixClassName(
    `cursor-pointer bg-ock-secondary hover:bg-ock-secondary-hover active:bg-ock-secondary-active focus:bg-ock-secondary-active`,
  ),
  coinbaseBranding: prefixClassName(
    'cursor-pointer bg-[#0052FF] hover:bg-[#0045D8]',
  ),
  disabled: prefixClassName('opacity-[0.38] pointer-events-none'),
} as const;

export const border = {
  lineDefault: prefixClassName('border-ock-line border'),
} as const;
