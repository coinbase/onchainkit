import type { definitions } from '@reservoir0x/reservoir-sdk';
import { useQuery } from '@tanstack/react-query';
import { ENVIRONMENT_VARIABLES } from '../constants';

export function useOwners(contractAddress: string, tokenId?: string) {
  const qs = tokenId
    ? `token=${contractAddress}:${tokenId}`
    : `collection=${contractAddress}`;
  return useQuery({
    queryKey: ['owners', contractAddress],
    queryFn: async () => {
      const response = await fetch(
        `https://api-base.reservoir.tools/owners/v2?${qs}&limit=2`,
        {
          method: 'GET',
          headers: {
            accept: '*/*',
            'x-api-key': ENVIRONMENT_VARIABLES.RESERVOIR_API_KEY ?? '',
          },
        },
      );
      const data = await response.json();
      return data as definitions['getOwnersV2Response'];
    },
  });
}
