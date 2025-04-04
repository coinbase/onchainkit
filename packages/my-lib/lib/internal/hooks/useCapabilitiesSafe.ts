import { useMemo } from 'react';
import type { WalletCapabilities } from 'viem';
import { useAccount } from 'wagmi';
import { useCapabilities } from 'wagmi/experimental';
import type { UseCapabilitiesSafeParams } from '../../core/types';

export function useCapabilitiesSafe({
  chainId,
}: UseCapabilitiesSafeParams): WalletCapabilities {
  const { isConnected } = useAccount();

  const { data: capabilities, error } = useCapabilities({
    query: { enabled: isConnected },
  });

  return useMemo(() => {
    if (error || !capabilities || !capabilities[chainId]) {
      return {};
    }

    return capabilities[chainId];
  }, [capabilities, chainId, error]);
}
