import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Address } from 'viem';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getSlicedAddress = (address: Address) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
