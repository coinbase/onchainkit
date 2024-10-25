import type { definitions } from '@reservoir0x/reservoir-sdk';
import { useQuery } from '@tanstack/react-query';
import { ENVIRONMENT_VARIABLES } from '../constants';

type NonNullable<T> = T & {};
type Token = NonNullable<
  NonNullable<definitions['getTokensV7Response']['tokens']>[0]
>['token'];

export function useToken(contractAddress: string, tokenId?: string) {
  return useQuery({
    queryKey: ['token', contractAddress, tokenId],
    queryFn: async () => {
      const qs = tokenId
        ? `tokens=${contractAddress}:${tokenId}`
        : `collection=${contractAddress}`;
      const response = await fetch(
        `https://api-base.reservoir.tools/tokens/v7?${qs}&includeLastSale=true&includeMintStages=true`,
        {
          method: 'GET',
          headers: {
            accept: '*/*',
            'x-api-key': ENVIRONMENT_VARIABLES.RESERVOIR_API_KEY ?? '',
          },
        },
      );
      const data = await response.json();
      // if no tokenId, get the collection and default to the first token
      return data.tokens[0].token as Token;
    },
  });
}
