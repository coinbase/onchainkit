import fs from 'fs';
import { baseSepolia } from 'viem/chains';
import { getOnchainKitConfig, getRPCUrl, setOnchainKitConfig } from './OnchainKitConfig';

describe('OnchainKitConfig', () => {
  it('should have a get function to access the config', () => {
    expect(getOnchainKitConfig).toBeDefined();
  });

  it('should have a set function to update the config', () => {
    expect(setOnchainKitConfig).toBeDefined();
  });

  it('should require an api key if rpc url is unset', () => {
    const chain = baseSepolia;
    setOnchainKitConfig({ chain });
    expect(() => getRPCUrl()).toThrow(
      'RPC URL Unset: You can use the Coinbase Developer Platform RPC by providing an API key in `setOnchainKitConfig`: https://portal.cdp.coinbase.com/products/templates',
    );
  });

  it('should return the correct config value', () => {
    const chain = baseSepolia;
    const schemaId = '0x123';
    const apiKey = 'test-api-key';
    const rpcUrl = `https://api.developer.coinbase.com/rpc/v1/base-sepolia/test-api-key`;
    setOnchainKitConfig({ chain, schemaId, apiKey });
    expect(getOnchainKitConfig('chain')).toEqual(chain);
    expect(getOnchainKitConfig('schemaId')).toEqual(schemaId);
    expect(getOnchainKitConfig('apiKey')).toEqual(apiKey);
    expect(getRPCUrl()).toEqual(rpcUrl);
  });

  it('should update the config value', () => {
    const chain = baseSepolia;
    const schemaId = '0x123';
    const apiKey = 'updated-api-key';
    const rpcUrl = `https://api.developer.coinbase.com/rpc/v1/base-sepolia/updated-api-key`;
    setOnchainKitConfig({ chain, schemaId, apiKey, rpcUrl });
    expect(getOnchainKitConfig('chain')).toEqual(chain);
    expect(getOnchainKitConfig('schemaId')).toEqual(schemaId);
    expect(getOnchainKitConfig('apiKey')).toEqual(apiKey);
    expect(getRPCUrl()).toEqual(rpcUrl);

    const newSchemaId = '0x456';
    setOnchainKitConfig({ schemaId: newSchemaId });
    expect(getOnchainKitConfig('chain')).toEqual(chain);
    expect(getOnchainKitConfig('schemaId')).toEqual(newSchemaId);
    expect(getOnchainKitConfig('apiKey')).toEqual(apiKey);
  });
});
