import { LegacyTokenData, Token } from '../types';

export function formatToken(legacyTokenData: LegacyTokenData): Token {
  return {
    address: legacyTokenData.address,
    chainId: legacyTokenData.chainId,
    decimals: legacyTokenData.decimals,
    image: legacyTokenData.imageURL || null,
    name: legacyTokenData.name,
    symbol: legacyTokenData.currencyCode,
  };
}

export function formatTokens(legacyTokenData: LegacyTokenData[]): Token[] {
  return legacyTokenData.map(formatToken);
}
