import { formatToken, formatTokens } from '../core/formatToken';
import { LegacyTokenData, Token } from '../types';

describe('formatToken', () => {
  it('should format a single legacy token data object into a token object', () => {
    const legacyTokenData: LegacyTokenData = {
      address: '0x1234567890abcdef',
      chainId: 1,
      decimals: 18,
      imageURL: 'https://example.com/token.png',
      name: 'Example Token',
      currencyCode: 'ETK',
      blockchain: '',
      aggregators: [],
      swappable: false,
      unverified: false,
    };

    const expectedToken: Token = {
      address: '0x1234567890abcdef',
      chainId: 1,
      decimals: 18,
      image: 'https://example.com/token.png',
      name: 'Example Token',
      symbol: 'ETK',
    };

    const formattedToken = formatToken(legacyTokenData);

    expect(formattedToken).toEqual(expectedToken);
  });

  it('should set image to null if imageURL is not provided', () => {
    const legacyTokenData: LegacyTokenData = {
      address: '0x1234567890abcdef',
      chainId: 1,
      decimals: 18,
      imageURL: 'https://example.com/token.png',
      name: 'Example Token',
      currencyCode: 'ETK',
      blockchain: '',
      aggregators: [],
      swappable: false,
      unverified: false,
    };

    const expectedToken: Token = {
      address: '0x1234567890abcdef',
      chainId: 1,
      decimals: 18,
      image: null,
      name: 'Example Token',
      symbol: 'ETK',
    };

    const formattedToken = formatToken(legacyTokenData);

    expect(formattedToken).toEqual(expectedToken);
  });
});

describe('formatTokens', () => {
  it('should format an array of legacy token data objects into an array of token objects', () => {
    const legacyTokenData: LegacyTokenData[] = [
      {
        address: '0x1234567890abcdef',
        chainId: 1,
        decimals: 18,
        imageURL: 'https://example.com/token.png',
        name: 'Example Token',
        currencyCode: 'ETK',
        blockchain: '',
        aggregators: [],
        swappable: false,
        unverified: false,
      },
    ];

    const expectedTokens: Token[] = [
      {
        address: '0x1234567890abcdef',
        chainId: 1,
        decimals: 18,
        image: null,
        name: 'Example Token',
        symbol: 'ETK',
      },
    ];

    const formattedTokens = formatTokens(legacyTokenData);

    expect(formattedTokens).toEqual(expectedTokens);
  });

  it('should return an empty array if no legacy token data objects are provided', () => {
    const legacyTokenData: LegacyTokenData[] = [];

    const formattedTokens = formatTokens(legacyTokenData);

    expect(formattedTokens).toEqual([]);
  });
});
