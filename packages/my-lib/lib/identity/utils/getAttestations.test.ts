import { getAttestationsByFilter } from '@/core/network/attestations';
/**
 * @vitest-environment jsdom
 */
import { base, opBNBTestnet } from 'viem/chains';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import type { GetAttestationsOptions } from '../types';
import { getAttestations } from './getAttestations';

vi.mock('@/core/network/attestations');

describe('getAttestations', () => {
  const mockAddress = '0x1234567890abcdef1234567890abcdef12345678';
  const mockOptions: GetAttestationsOptions = { schemas: ['0x12345'] };
  const mockAttestations = [
    {
      attester: '0x357458739F90461b99789350868CD7CF330Dd7EE',
      expirationTime: 0,
      id: '0x93016a60f13e7cfe0257116aedfce7088c2c0020787a325ea9f6b4ba11d07598',
      recipient: '0x44a7D120beA87455071cebB841eF91E6Ae21bC1a',
      revocationTime: 0,
      schemaId:
        '0x1801901fabd0e6189356b4fb52bb0ab855276d84f7ec140839fbd1f6801ca065',
      timeCreated: 1707269100,
      txid: '0x88448267566c9546ff31b9e6be229fb960f12bec8bc441259c7b064ae4159d34',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns an empty array if no address is provided', async () => {
    const result = await getAttestations(
      null as unknown as `0x${string}`,
      base,
      mockOptions,
    );
    expect(result).toEqual([]);
    expect(getAttestationsByFilter).not.toHaveBeenCalled();
  });

  it('should return and empty array for unsupported chains', async () => {
    const result = await getAttestations(
      mockAddress,
      opBNBTestnet,
      mockOptions,
    );
    expect(result).toEqual([]);
  });

  it('fetches attestations for supported chains', async () => {
    (getAttestationsByFilter as Mock).mockResolvedValue(mockAttestations);
    const result = await getAttestations(mockAddress, base, mockOptions);
    expect(result).toEqual(mockAttestations); // Replace [] with expected mockAttestations once implemented
  });

  it('uses default values when options are not provided', async () => {
    // Call the function without the options parameter
    await getAttestations(mockAddress, base);
    // Check if getAttestationsByFilter is called with default values
    expect(getAttestationsByFilter).toHaveBeenCalledWith(mockAddress, base, {
      revoked: false,
      expirationTime: expect.any(Number),
      limit: 10,
    });
  });

  it('handles errors from getAttestationsByFilter correctly', async () => {
    (getAttestationsByFilter as Mock).mockRejectedValue(
      new Error('Network error'),
    );
    const result = await getAttestations(mockAddress, base);
    expect(result).toEqual([]);
  });

  it('uses defaultQueryVariablesFilter when no options are provided', async () => {
    const mockAddress = '0x1234567890abcdef1234567890abcdef12345678';
    const chain = base; // assuming 'base' is a supported chain

    // Call the function without options
    await getAttestations(mockAddress, chain);

    // Check if getAttestationsByFilter is called with the correct default values
    expect(getAttestationsByFilter).toHaveBeenCalledWith(mockAddress, chain, {
      revoked: false, // Default value for revoked
      expirationTime: expect.any(Number), // Should be a timestamp
      limit: 10, // Default limit
    });
  });

  it('uses custom filter options when provided', async () => {
    const customOptions = {
      schemas: ['0x98765'],
      revoked: true,
      expirationTime: 1234567890,
      limit: 5,
    } as GetAttestationsOptions;

    // Call the function with custom options
    await getAttestations(mockAddress, base, customOptions);

    // Check if getAttestationsByFilter is called with the custom options
    expect(getAttestationsByFilter).toHaveBeenCalledWith(
      mockAddress,
      base,
      customOptions,
    );
  });
});
