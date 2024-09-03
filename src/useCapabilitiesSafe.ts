import { useAccount } from 'wagmi';
import { useCapabilities } from 'wagmi/experimental';
import type { WalletCapabilities } from './types';

export function useCapabilitiesSafe({
  chainId,
}: {
  chainId: number;
}): WalletCapabilities {
  const { connector, isConnected } = useAccount();

  // Metamask doesn't support wallet_getCapabilities
  const isMetamaskWallet = connector?.id === 'io.metamask';
  const enabled = isConnected && !isMetamaskWallet;

  const { data: capabilities } = useCapabilities({ query: { enabled } });

  if (!capabilities || !capabilities[chainId]) {
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
