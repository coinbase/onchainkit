import type { definitions } from '@reservoir0x/reservoir-sdk';
import { useQuery } from '@tanstack/react-query';
import { ENVIRONMENT_VARIABLES } from '../constants';

type NonNullable<T> = T & {};
type Collection = NonNullable<
  definitions['getCollectionsV7Response']['collections']
>[0];

export function useCollection(contractAddress: string) {
  return useQuery({
    queryKey: ['collection', contractAddress],
    queryFn: async () => {
      const response = await fetch(
        `https://api-base.reservoir.tools/collections/v7?id=${contractAddress}&includeMintStages=true`,
        {
          method: 'GET',
          headers: {
            accept: '*/*',
            'x-api-key': ENVIRONMENT_VARIABLES.RESERVOIR_API_KEY ?? '',
          },
        },
      );
      const data = await response.json();
      return data.collections[0] as Collection;
    },
  });
}
