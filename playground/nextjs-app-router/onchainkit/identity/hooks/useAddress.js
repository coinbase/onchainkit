import { useQuery } from '@tanstack/react-query';
import { mainnet } from 'viem/chains';
import { getAddress } from '../utils/getAddress.js';
const useAddress = ({
  name,
  chain = mainnet
}, queryOptions) => {
  const _ref = queryOptions ?? {},
    _ref$enabled = _ref.enabled,
    enabled = _ref$enabled === void 0 ? true : _ref$enabled,
    cacheTime = _ref.cacheTime;
  const actionKey = `useAddress-${name}-${chain.id}`;
  return useQuery({
    queryKey: ['useAddress', actionKey],
    queryFn: async () => {
      return await getAddress({
        name,
        chain
      });
    },
    gcTime: cacheTime,
    enabled,
    refetchOnWindowFocus: false
  });
};
export { useAddress };
//# sourceMappingURL=useAddress.js.map
