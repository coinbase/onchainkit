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

  it('should return the correct config value', () => {
    const chain = baseSepolia;
    const schemaId = '0x123';
    setOnchainKitConfig({ chain, schemaId });
    expect(getOnchainKitConfig('chain')).toEqual(chain);
    expect(getOnchainKitConfig('schemaId')).toEqual(schemaId);
  });

  it('should update the config value', () => {
    const chain = baseSepolia;
    const schemaId = '0x123';
    setOnchainKitConfig({ chain, schemaId });
    expect(getOnchainKitConfig('chain')).toEqual(chain);
    expect(getOnchainKitConfig('schemaId')).toEqual(schemaId);

    const newSchemaId = '0x456';
    setOnchainKitConfig({ schemaId: newSchemaId });
    expect(getOnchainKitConfig('chain')).toEqual(chain);
    expect(getOnchainKitConfig('schemaId')).toEqual(newSchemaId);
  });
});
