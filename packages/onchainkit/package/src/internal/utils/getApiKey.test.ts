import { setOnchainKitConfig } from '@/core/OnchainKitConfig';
import { describe, expect, it } from 'vitest';
import { getApiKey } from './getApiKey';

describe('getApiKey', () => {
  it('should throw exception if API key is not set', () => {
    setOnchainKitConfig({});
    expect(() => getApiKey()).toThrow(
      'API Key Unset: Please set the API Key by providing it in the `OnchainKitProvider` or by manually calling `setOnchainKitConfig`. For more information, visit: https://portal.cdp.coinbase.com/products/onchainkit',
    );
  });

  it('should return the correct api key', () => {
    const apiKey = 'test-api-key';
    setOnchainKitConfig({ apiKey });
    expect(getApiKey()).toEqual(apiKey);
  });
});
