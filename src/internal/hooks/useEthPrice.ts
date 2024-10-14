import {
  type UseQueryOptions,
  type UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { getEthPrice } from '../utils/getEthPrice';

export function useEthPrice(
  queryOptions?: UseQueryOptions<number, Error>,
): UseQueryResult<number> {
  const { enabled = true } = queryOptions ?? {};
  return useQuery({
    queryKey: ['useEthPrice'],
    queryFn: async () => {
      return getEthPrice();
    },
    enabled,
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: false,
  });
}
