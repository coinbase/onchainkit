import { baseSepolia } from 'viem/chains';
import { describe, expect, it } from 'vitest';
import { getOnchainKitConfig, setOnchainKitConfig } from './OnchainKitConfig';
import { getRPCUrl } from './network/getRPCUrl';

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
      'API Key Unset: You can use the Coinbase Developer Platform RPC by providing an API key in `OnchainKitProvider` or by manually calling `setOnchainKitConfig`: https://portal.cdp.coinbase.com/products/onchainkit',
    );
  });

  it('should return the correct config value', () => {
    const chain = baseSepolia;
    const schemaId = '0x123';
    const apiKey = 'test-api-key';
    const projectId = 'test-project-id';
    const rpcUrl =
      'https://api.developer.coinbase.com/rpc/v1/base-sepolia/test-api-key';
    setOnchainKitConfig({ chain, schemaId, apiKey, projectId });
    expect(getOnchainKitConfig('chain')).toEqual(chain);
    expect(getOnchainKitConfig('schemaId')).toEqual(schemaId);
    expect(getOnchainKitConfig('apiKey')).toEqual(apiKey);
    expect(getOnchainKitConfig('projectId')).toEqual(projectId);
    expect(getRPCUrl()).toEqual(rpcUrl);
  });

  it('should update the config value', () => {
    const chain = baseSepolia;
    const schemaId = '0x123';
    const apiKey = 'updated-api-key';
    const rpcUrl =
      'https://api.developer.coinbase.com/rpc/v1/base-sepolia/updated-api-key';
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
