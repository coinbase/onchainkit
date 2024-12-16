import { SwapUnit } from '@/swap/types';

export type BuyTokens = {
  fromETH: SwapUnit;
  fromUSDC: SwapUnit;
  to: SwapUnit;
  from?: SwapUnit;
};
