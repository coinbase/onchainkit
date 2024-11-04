import { useQuery } from '@tanstack/react-query';
import { mainnet } from 'viem/chains';
import { getAvatar } from '../utils/getAvatar.js';

/**
 * Gets an ensName and resolves the Avatar
 */
const useAvatar = ({
  ensName,
  chain = mainnet
}, queryOptions) => {
  const _ref = queryOptions ?? {},
    _ref$enabled = _ref.enabled,
    enabled = _ref$enabled === void 0 ? true : _ref$enabled,
    cacheTime = _ref.cacheTime;
  const ensActionKey = `ens-avatar-${ensName}-${chain.id}`;
  return useQuery({
    queryKey: ['useAvatar', ensActionKey],
    queryFn: async () => {
      return getAvatar({
        ensName,
        chain
      });
    },
    gcTime: cacheTime,
    enabled,
    refetchOnWindowFocus: false
  });
};
export { useAvatar };
//# sourceMappingURL=useAvatar.js.map
