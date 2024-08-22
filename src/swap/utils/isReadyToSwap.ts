import type { Address } from 'viem';
import type { Token } from '../../token/types';

export const isReadyToSwap = (
  address?: Address,
  fromToken?: Token,
  toToken?: Token,
  amount?: string,
): boolean => {
  if (!address || !fromToken || !toToken || !amount) {
    return false;
  }
  return true;
};
