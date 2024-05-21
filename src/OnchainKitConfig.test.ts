import fs from 'fs';
import { baseSepolia } from 'viem/chains';
import { getOnchainKitConfig, setOnchainKitConfig } from './OnchainKitConfig';

describe('OnchainKitConfig', () => {
  it('should have a get function to access the config', () => {
    expect(getOnchainKitConfig).toBeDefined();
  });

  it('should have a set function to update the config', () => {
    expect(setOnchainKitConfig).toBeDefined();
  });

  it('should require an api key', () => {
    const chain = baseSepolia;
    expect(() => setOnchainKitConfig({ chain })).toThrow(
      'API Key is required to use OnchainKit - get your API key from the Coinbase Developer Platform: https://portal.cdp.coinbase.com/products/templates',
    );
  });

  it('should return the correct config value', () => {
    const chain = baseSepolia;
    const schemaId = '0x123';
    const apiKey = 'test-api-key';
    const expectedRpcUrl = `https://api.developer.coinbase.com/rpc/v1/base-sepolia/test-api-key`;
    setOnchainKitConfig({ chain, schemaId, apiKey });
    expect(getOnchainKitConfig('chain')).toEqual(chain);
    expect(getOnchainKitConfig('schemaId')).toEqual(schemaId);
    expect(getOnchainKitConfig('apiKey')).toEqual(apiKey);
    expect(getOnchainKitConfig('rpcUrl')).toEqual(expectedRpcUrl);
  });

  it('should update the config value', () => {
    const chain = baseSepolia;
    const schemaId = '0x123';
    const apiKey = 'updated-api-key';
    const expectedUpdatedRpcUrl = `https://api.developer.coinbase.com/rpc/v1/base-sepolia/updated-api-key`;
    setOnchainKitConfig({ chain, schemaId, apiKey });
    expect(getOnchainKitConfig('chain')).toEqual(chain);
    expect(getOnchainKitConfig('schemaId')).toEqual(schemaId);
    expect(getOnchainKitConfig('apiKey')).toEqual(apiKey);
    expect(getOnchainKitConfig('rpcUrl')).toEqual(expectedUpdatedRpcUrl);

    const newSchemaId = '0x456';
    setOnchainKitConfig({ schemaId: newSchemaId });
    expect(getOnchainKitConfig('chain')).toEqual(chain);
    expect(getOnchainKitConfig('schemaId')).toEqual(newSchemaId);
    expect(getOnchainKitConfig('apiKey')).toEqual(apiKey);
  });
});
