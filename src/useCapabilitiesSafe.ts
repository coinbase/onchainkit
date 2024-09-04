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
      hasPaymasterService: false,
      hasAtomicBatch: false,
      hasAuxiliaryFunds: false,
    };
  }

  return {
    hasPaymasterService:
      capabilities[chainId].paymasterService?.supported ?? false,
    hasAtomicBatch: capabilities[chainId].atomicBatch?.supported ?? false,
    hasAuxiliaryFunds: capabilities[chainId].auxiliaryFunds?.supported ?? false,
  };
}
