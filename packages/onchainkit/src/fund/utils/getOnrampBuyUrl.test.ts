import { describe, expect, it } from 'vitest';
import { version } from '@/version';
import { getOnrampBuyUrl } from './getOnrampBuyUrl';

describe('getOnrampBuyUrl', () => {
  it('should return the correct URL when using project ID props', () => {
    const url = getOnrampBuyUrl({
      sessionToken: 'session-token',
    });
    expect(url).toEqual(
      `https://pay.coinbase.com/buy?sdkVersion=onchainkit%40${version}&sessionToken=session-token`,
    );
  });

  it('should return the correct URL when using session token props', () => {
    const url = getOnrampBuyUrl({
      sessionToken: 'session-token',
    });
    expect(url).toEqual(
      `https://pay.coinbase.com/buy?sdkVersion=onchainkit%40${version}&sessionToken=session-token`,
    );
  });

  it('should include optional params in the query string', () => {
    const url = getOnrampBuyUrl({
      sessionToken: 'session-token',
      defaultAsset: 'USDC',
      defaultNetwork: 'ethereum',
    });
    expect(url).toEqual(
      `https://pay.coinbase.com/buy?defaultAsset=USDC&defaultNetwork=ethereum&sdkVersion=onchainkit%40${version}&sessionToken=session-token`,
    );
  });

  it('should include originComponentName in sdkVersion when provided', () => {
    const url = getOnrampBuyUrl({
      sessionToken: 'session-token',
      originComponentName: 'FundCard',
    });
    expect(url).toEqual(
      `https://pay.coinbase.com/buy?sdkVersion=onchainkit%40${version}%3AFundCard&sessionToken=session-token`,
    );
  });

  it('should handle all optional parameters including originComponentName', () => {
    const url = getOnrampBuyUrl({
      sessionToken: 'session-token',
      defaultAsset: 'ETH',
      defaultNetwork: 'base',
      presetCryptoAmount: 0.5,
      defaultPaymentMethod: 'CARD',
      fiatCurrency: 'EUR',
      originComponentName: 'BuyButton',
    });
    expect(url).toContain('defaultAsset=ETH');
    expect(url).toContain('defaultNetwork=base');
    expect(url).toContain('presetCryptoAmount=0.5');
    expect(url).toContain('defaultPaymentMethod=CARD');
    expect(url).toContain('fiatCurrency=EUR');
    expect(url).toContain(`sdkVersion=onchainkit%40${version}%3ABuyButton`);
    expect(url).toContain('sessionToken=session-token');
  });

  it('should omit sdkVersion component suffix when originComponentName is not provided', () => {
    const url = getOnrampBuyUrl({
      sessionToken: 'session-token',
    });
    expect(url).toEqual(
      `https://pay.coinbase.com/buy?sdkVersion=onchainkit%40${version}&sessionToken=session-token`,
    );
  });

  it('should handle complex parameter types by JSON stringifying them', () => {
    // Testing lines 22-23: JSON.stringify for non-primitive values
    const url = getOnrampBuyUrl({
      sessionToken: 'session-token',
      // @ts-ignore - intentionally passing complex type to test JSON.stringify path
      customData: { key: 'value', nested: { data: true } },
      // @ts-ignore - intentionally passing array to test JSON.stringify path
      items: ['item1', 'item2'],
    });
    
    // Verify that complex objects are JSON stringified in the URL
    expect(url).toContain(
      'customData=%7B%22key%22%3A%22value%22%2C%22nested%22%3A%7B%22data%22%3Atrue%7D%7D',
    );
    expect(url).toContain('items=%5B%22item1%22%2C%22item2%22%5D');
    expect(url).toContain('sessionToken=session-token');
  });

  it('should handle undefined values by omitting them from the URL', () => {
    const url = getOnrampBuyUrl({
      sessionToken: 'session-token',
      defaultAsset: undefined,
      presetCryptoAmount: undefined,
      fiatCurrency: 'USD',
    });
    
    // Should not include undefined parameters
    expect(url).not.toContain('defaultAsset');
    expect(url).not.toContain('presetCryptoAmount');
    // Should include defined parameters
    expect(url).toContain('fiatCurrency=USD');
    expect(url).toContain('sessionToken=session-token');
  });
});
