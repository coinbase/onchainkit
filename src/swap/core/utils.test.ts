import type { Token } from '../../token';
import { getParamsForToken, formatDecimals } from './utils';

describe('getParamsForToken', () => {
  it('should return the correct GetQuoteAPIParams object', () => {
    const from: Token = {
      name: 'ETH',
      address: '',
      symbol: 'ETH',
      decimals: 18,
      image: 'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
      chainId: 8453,
    };
    const to: Token = {
      name: 'DEGEN',
      address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
      symbol: 'DEGEN',
      decimals: 18,
      image:
        'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/3b/bf/3bbf118b5e6dc2f9e7fc607a6e7526647b4ba8f0bea87125f971446d57b296d2-MDNmNjY0MmEtNGFiZi00N2I0LWIwMTItMDUyMzg2ZDZhMWNm',
      chainId: 8453,
    };
    const amount = '1.5';
    const amountReference = 'from';

    const expectedParams = {
      from: 'ETH',
      to: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
      amount: '1.5',
      amountReference: 'from',
    };

    const result = getParamsForToken({
      from,
      to,
      amount,
      amountReference,
    });

    expect(result).toEqual(expectedParams);
  });

  it('should use the default for amountReference', () => {
    const from: Token = {
      name: 'ETH',
      address: '',
      symbol: 'ETH',
      decimals: 18,
      image: 'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
      chainId: 8453,
    };
    const to: Token = {
      name: 'DEGEN',
      address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
      symbol: 'DEGEN',
      decimals: 18,
      image:
        'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/3b/bf/3bbf118b5e6dc2f9e7fc607a6e7526647b4ba8f0bea87125f971446d57b296d2-MDNmNjY0MmEtNGFiZi00N2I0LWIwMTItMDUyMzg2ZDZhMWNm',
      chainId: 8453,
    };
    const amount = '1.5';

    const expectedParams = {
      from: 'ETH',
      to: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
      amount: '1.5',
      amountReference: 'from',
    };

    const result = getParamsForToken({
      from,
      to,
      amount,
    });

    expect(result).toEqual(expectedParams);
  });
});

describe('formatDecimals', () => {
  it('should format the amount correctly with default decimals', () => {
    const amount = '1500000000000000000';
    const expectedFormattedAmount = '1.5';
    const result = formatDecimals(amount, true, 18);
    expect(result).toEqual(expectedFormattedAmount);
  });

  it('should format the amount correctly with custom decimals', () => {
    const amount = '1500000000000000000';
    const decimals = 9;
    const expectedFormattedAmount = '1500000000';
    const result = formatDecimals(amount, true, decimals);
    expect(result).toEqual(expectedFormattedAmount);
  });

  it('should format the amount correctly with default decimals when inputInDecimals is false', () => {
    const amount = '1.5';
    const expectedFormattedAmount = '1500000000000000000';
    const result = formatDecimals(amount, false, 18);
    expect(result).toEqual(expectedFormattedAmount);
  });

  it('should format the amount correctly with custom decimals when inputInDecimals is false', () => {
    const amount = '1.5';
    const decimals = 9;
    const expectedFormattedAmount = '1500000000';
    const result = formatDecimals(amount, false, decimals);
    expect(result).toEqual(expectedFormattedAmount);
  });
});
