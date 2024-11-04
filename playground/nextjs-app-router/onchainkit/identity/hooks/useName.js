import { useQuery } from '@tanstack/react-query';
import { mainnet } from 'viem/chains';
import { getName } from '../utils/getName.js';

/**
 * It leverages the `@tanstack/react-query` hook for fetching and optionally caching the ENS name
 * @returns An object containing:
 *  - `ensName`: The fetched ENS name for the provided address, or null if not found or in case of an error.
 *  - `{UseQueryResult}`: The rest of useQuery return values. including isLoading, isError, error, isFetching, refetch, etc.
 */
const useName = ({
  address,
  chain = mainnet
}, queryOptions) => {
  const _ref = queryOptions ?? {},
    _ref$enabled = _ref.enabled,
    enabled = _ref$enabled === void 0 ? true : _ref$enabled,
    cacheTime = _ref.cacheTime;
  const ensActionKey = `ens-name-${address}-${chain.id}`;
  return useQuery({
    queryKey: ['useName', ensActionKey],
    queryFn: async () => {
      return await getName({
        address,
        chain
      });
    },
    gcTime: cacheTime,
    enabled,
    refetchOnWindowFocus: false
  });
};
export { useName };
//# sourceMappingURL=useName.js.map
