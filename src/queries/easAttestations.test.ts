import {
  GetEASAttestationsByFilterOptions,
  getEASAttestationQueryVariables,
  getEASAttestationsByFilter,
  easAttestationQuery,
} from './easAttestations';
import { createEasGraphQLClient } from '../network/createEasGraphQLClient';
import { base } from 'viem/chains';

jest.mock('../network/createEasGraphQLClient');

describe('EAS Attestation Service', () => {
  const mockAddress = '0xdbf03b407c01e7cd3cbea99509d93f8dddc8c6fb';
  const mockChecksummedAddress = '0xdbF03B407c01E7cD3CBea99509d93f8DDDC8C6FB';
  const mockFilters: GetEASAttestationsByFilterOptions = {
    limit: 10,
    revoked: false,
    expirationTime: 1234567890,
    schemas: ['0x1', '0x2'],
  };

  describe('getEASAttestationQueryVariables', () => {
    it('should create correct query variables', () => {
      const variables = getEASAttestationQueryVariables(mockAddress, mockFilters);
      expect(variables).toEqual({
        where: {
          AND: [
            {
              recipient: { equals: mockChecksummedAddress },
              revoked: { equals: mockFilters.revoked },
              OR: [
                { expirationTime: { equals: 0 } },
                { expirationTime: { gt: mockFilters.expirationTime } },
              ],
              schemaId: { in: mockFilters.schemas },
            },
          ],
        },
        distinct: ['schemaId'],
        take: mockFilters.limit,
      });
    });
  });

  describe('getEASAttestationsByFilter', () => {
    it('should fetch attestations correctly', async () => {
      const mockClient = {
        request: jest.fn().mockResolvedValue({
          attestations: [],
        }),
      };
      (createEasGraphQLClient as jest.Mock).mockReturnValue(mockClient);

      const result = await getEASAttestationsByFilter(mockAddress, base, mockFilters);

      expect(createEasGraphQLClient).toHaveBeenCalledWith(base);
      expect(mockClient.request).toHaveBeenCalledWith(easAttestationQuery, expect.any(Object));
      expect(result).toEqual([]);
    });
  });
});
