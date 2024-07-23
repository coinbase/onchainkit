import { describe, expect, it } from 'vitest';
import { convertToNeynarResponseModel } from './convertToNeynarResponseModel';

describe('convertToNeynarResponseModel', () => {
  it('should return undefined when no data is provided', () => {
    const result = convertToNeynarResponseModel(undefined);
    expect(result).toBeUndefined();
  });

  it('should convert data correctly when provided', () => {
    const mockData = {
      valid: true,
      action: {
        address: '0x123',
        tapped_button: { index: 1 },
        interactor: {
          viewer_context: {
            following: true,
          },
          fid: 123,
          custody_address: '0x456',
          verifications: ['0x789'],
          verified_addresses: {
            eth_addresses: ['0xethAddress'],
            sol_addresses: ['0xsolAddress'],
          },
        },
        input: { text: 'test input' },
        cast: {
          viewer_context: {
            liked: true,
            recasted: false,
          },
        },
        state: { serialized: 'test serialized state' },
        transaction: 'test transaction data',
      },
    };

    const result = convertToNeynarResponseModel(mockData);

    expect(result).toEqual({
      address: '0x123',
      button: 1,
      following: true,
      input: 'test input',
      interactor: {
        fid: 123,
        custody_address: '0x456',
        verified_accounts: ['0x789'],
        verified_addresses: {
          eth_addresses: ['0xethAddress'],
          sol_addresses: ['0xsolAddress'],
        },
      },
      liked: true,
      raw: mockData,
      recasted: false,
      state: {
        serialized: 'test serialized state',
      },
      transaction: 'test transaction data',
      valid: true,
    });
  });
});
