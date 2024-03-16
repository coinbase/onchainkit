/**
 * @jest-environment jsdom
 */

import { getEASAttestationsByFilter } from '../queries/easAttestations';
import { getEASAttestations } from './getEASAttestations';
import { easSupportedChains } from '../identity/easSupportedChains';
import { base, opBNBTestnet } from 'viem/chains';
import { GetEASAttestationsOptions } from './types';

jest.mock('../queries/easAttestations');

describe('getEASAttestations', () => {
  const mockAddress = '0x1234567890abcdef1234567890abcdef12345678';
  const mockOptions: GetEASAttestationsOptions = { schemas: ['0x12345'] };
  const mockAttestations = [
    {
      attester: '0x357458739F90461b99789350868CD7CF330Dd7EE',
      expirationTime: 0,
      id: '0x93016a60f13e7cfe0257116aedfce7088c2c0020787a325ea9f6b4ba11d07598',
      recipient: '0x44a7D120beA87455071cebB841eF91E6Ae21bC1a',
      revocationTime: 0,
      schemaId: '0x1801901fabd0e6189356b4fb52bb0ab855276d84f7ec140839fbd1f6801ca065',
      timeCreated: 1707269100,
      txid: '0x88448267566c9546ff31b9e6be229fb960f12bec8bc441259c7b064ae4159d34',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws an error for unsupported chains', () => {
    try {
      getEASAttestations(mockAddress, opBNBTestnet, mockOptions);
    } catch (e) {
      expect(e).toHaveProperty(
        'message',
        `Chain is not supported. Supported chains: ${Object.keys(easSupportedChains).join(', ')}`,
      );
    }
  });

  it('fetches attestations for supported chains', async () => {
    (getEASAttestationsByFilter as jest.Mock).mockResolvedValue(mockAttestations);

    const result = await getEASAttestations(mockAddress, base, mockOptions);
    expect(result).toEqual(mockAttestations); // Replace [] with expected mockAttestations once implemented
  });

  it('uses default values when options are not provided', async () => {
    // Call the function without the options parameter
    await getEASAttestations(mockAddress, base);
    // Check if getEASAttestationsByFilter is called with default values
    expect(getEASAttestationsByFilter).toHaveBeenCalledWith(mockAddress, base, {
      revoked: false,
      expirationTime: expect.any(Number),
      limit: 10,
    });
  });

  it('handles errors from getEASAttestationsByFilter correctly', async () => {
    (getEASAttestationsByFilter as jest.Mock).mockRejectedValue(new Error('Network error'));

    const result = await getEASAttestations(mockAddress, base);

    expect(result).toEqual([]);
  });

  it('uses defaultQueryVariablesFilter when no options are provided', async () => {
    const mockAddress = '0x1234567890abcdef1234567890abcdef12345678';
    const chain = base; // assuming 'base' is a supported chain

    // Call the function without options
    await getEASAttestations(mockAddress, chain);

    // Check if getEASAttestationsByFilter is called with the correct default values
    expect(getEASAttestationsByFilter).toHaveBeenCalledWith(mockAddress, chain, {
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
    } as GetEASAttestationsOptions;

    // Call the function with custom options
    await getEASAttestations(mockAddress, base, customOptions);

    // Check if getEASAttestationsByFilter is called with the custom options
    expect(getEASAttestationsByFilter).toHaveBeenCalledWith(mockAddress, base, customOptions);
  });
});
