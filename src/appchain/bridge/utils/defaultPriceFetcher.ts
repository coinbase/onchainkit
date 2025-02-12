import type { Token } from '@/token';
import { base, baseSepolia } from 'viem/chains';
import { USDC_BY_CHAIN } from '../constants';
import { getETHPrice } from './getETHPrice';

export const defaultPriceFetcher = async (amount: string, token: Token) => {
  if (!token.address) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const price = await getETHPrice();
    return (Number(price) * Number(amount)).toFixed(2);
  }
  if (
    token.address === USDC_BY_CHAIN[base.id].address ||
    token.address === USDC_BY_CHAIN[baseSepolia.id].address
  ) {
    return (Number(amount) * 1).toFixed(2);
  }
  return '';
};
