import { describe, expect, it } from 'vitest';
import { version } from '@/version';
import { getOnrampBuyUrl } from './getOnrampBuyUrl';

describe('getOnrampBuyUrl', () => {
  it('should return the correct URL when using project ID props', () => {
    const url = getOnrampBuyUrl({
      projectId: 'project-id',
      addresses: { '0x1': ['base'] },
      assets: ['USDC'],
    });
    expect(url).toEqual(
      `https://pay.coinbase.com/buy?addresses=%7B%220x1%22%3A%5B%22base%22%5D%7D&appId=project-id&assets=%5B%22USDC%22%5D&sdkVersion=onchainkit%40${version}`,
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
});
