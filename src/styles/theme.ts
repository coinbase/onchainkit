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
  title3: 'font-bold font-display text-xl leading-7',
} as const;

export const pressable = {};
