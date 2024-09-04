import { useAccount } from 'wagmi';
import { useCapabilities } from 'wagmi/experimental';
import type { UseCapabilitiesSafeParams, WalletCapabilities } from './types';

export function useCapabilitiesSafe({
  chainId,
}: UseCapabilitiesSafeParams): WalletCapabilities {
  const { isConnected } = useAccount();

  const { data: capabilities, error } = useCapabilities({
    query: { enabled: isConnected },
  });

  if (error || !capabilities || !capabilities[chainId]) {
    return {
      hasPaymasterServiceEnabled: false,
      hasAtomicBatchEnabled: false,
      hasAuxiliaryFundsEnabled: false,
    };
  }

  return {
    hasPaymasterServiceEnabled:
      capabilities[chainId]?.paymasterService?.supported,
    hasAtomicBatchEnabled: capabilities[chainId]?.atomicBatch?.supported,
    hasAuxiliaryFundsEnabled: capabilities[chainId]?.auxiliaryFunds?.supported,
  };
}
