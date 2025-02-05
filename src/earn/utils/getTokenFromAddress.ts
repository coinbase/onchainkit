import type { Token } from '@/token';
import { baseTokens } from '@/token/constants';
import type { Address } from 'viem';
import { base } from 'viem/chains';

function constructFallbackToken({
  symbol,
  name,
  decimals,
  address,
}: {
  symbol: string;
  name: string;
  decimals: number;
  address: Address;
}): Token {
  return {
    address,
    name,
    symbol,
    decimals,
    image: null,
    chainId: base.id,
  };
}

export function getToken({
  address,
  symbol,
  name,
  decimals,
}: { address: Address; symbol?: string; name?: string; decimals?: number }):
  | Token
  | undefined {
  const token = baseTokens.find((token) => token.address === address);
  if (token) {
    return token;
  }
  if (symbol && name && decimals) {
    return constructFallbackToken({ symbol, name, decimals, address });
  }

  return undefined;
}
