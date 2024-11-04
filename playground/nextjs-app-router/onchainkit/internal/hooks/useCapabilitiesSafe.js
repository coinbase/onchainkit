import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useCapabilities } from 'wagmi/experimental';
function useCapabilitiesSafe({
  chainId
}) {
  const _useAccount = useAccount(),
    isConnected = _useAccount.isConnected;
  const _useCapabilities = useCapabilities({
      query: {
        enabled: isConnected
      }
    }),
    capabilities = _useCapabilities.data,
    error = _useCapabilities.error;
  return useMemo(() => {
    if (error || !capabilities || !capabilities[chainId]) {
      return {};
    }
    return capabilities[chainId];
  }, [capabilities, chainId, error]);
}
export { useCapabilitiesSafe };
//# sourceMappingURL=useCapabilitiesSafe.js.map
