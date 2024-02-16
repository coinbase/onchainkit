import {
  GetEASAttestationsByFilterOptions,
  getEASAttestationQueryVariables,
  getEASAttestationsByFilter,
  easAttestationQuery,
} from './easAttestations';
import { createEasGraphQLClient } from '../network/easGraphQL';
import { base } from 'viem/chains';

jest.mock('../network/easGraphQL');

describe('EAS Attestation Service', () => {
  const mockAddress = '0x123';
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
              recipient: { equals: mockAddress },
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
