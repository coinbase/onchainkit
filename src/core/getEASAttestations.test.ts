/**
 * @jest-environment jsdom
 */

import { getEASAttestations, GetEASAttestationsOptions } from './getEASAttestations';
import { easSupportedChains } from '../utils/easAttestation';
import { base, opBNBTestnet } from 'viem/chains';

describe('getEASAttestations', () => {
  const mockAddress = '0x1234567890abcdef1234567890abcdef12345678';
  const mockOptions: GetEASAttestationsOptions = { schemas: ['0x12345'] };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws an error for unsupported chains', async () => {
    await expect(getEASAttestations(mockAddress, opBNBTestnet, mockOptions)).rejects.toThrow(
      `Chain is not supported. Supported chains: ${Object.keys(easSupportedChains).join(', ')}`,
    );
  });

  it('fetches attestations for supported chains', async () => {
    const result = await getEASAttestations(mockAddress, base, mockOptions);
    expect(result).toEqual([]); // Replace [] with expected mockAttestations once implemented
  });
});
