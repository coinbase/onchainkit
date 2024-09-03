import { useAccount } from 'wagmi';
import { useCapabilities } from 'wagmi/experimental';
import type { WalletCapabilities } from './types';

export function useCapabilitiesSafe({
  chainId,
}: {
  chainId: number;
}): WalletCapabilities {
  const { isConnected } = useAccount();

  const { data: capabilities, error } = useCapabilities({
    query: { enabled: isConnected },
  });

  if (error || !capabilities || !capabilities[chainId]) {
    return {
      paymasterServiceEnabled: false,
      atomicBatchEnabled: false,
      auxiliaryFundsEnabled: false,
    };
  }

  return {
    paymasterServiceEnabled: capabilities[chainId]?.paymasterService?.supported,
    atomicBatchEnabled: capabilities[chainId]?.atomicBatch?.supported,
    auxiliaryFundsEnabled: capabilities[chainId]?.auxiliaryFunds?.supported,
  };
}
