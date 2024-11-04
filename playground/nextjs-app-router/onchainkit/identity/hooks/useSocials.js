import { useQuery } from '@tanstack/react-query';
import { mainnet } from 'viem/chains';
import { getSocials } from '../utils/getSocials.js';
const useSocials = ({
  ensName,
  chain = mainnet
}, queryOptions) => {
  const _ref = queryOptions ?? {},
    _ref$enabled = _ref.enabled,
    enabled = _ref$enabled === void 0 ? true : _ref$enabled,
    cacheTime = _ref.cacheTime;
  const ensActionKey = `ens-socials-${ensName}-${chain.id}`;
  return useQuery({
    queryKey: ['useSocials', ensActionKey],
    queryFn: async () => {
      return getSocials({
        ensName,
        chain
      });
    },
    gcTime: cacheTime,
    enabled,
    refetchOnWindowFocus: false
  });
};
export { useSocials };
//# sourceMappingURL=useSocials.js.map
