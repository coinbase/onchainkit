import type { Chain } from 'viem';
import { useAccount } from 'wagmi';
import { useCapabilities } from 'wagmi/experimental';
import type { WalletCapabilities } from './types';

export function useCapabilitiesSafe({
  chain,
}: {
  chain: Chain;
}): WalletCapabilities {
  const { connector, isConnected } = useAccount();

  // Metamask doesn't support wallet_getCapabilities
  const isMetamaskWallet = connector?.id === 'io.metamask';
  const enabled = isConnected && !isMetamaskWallet;

  const { data: capabilities } = useCapabilities({ query: { enabled } });

  if (!capabilities || !capabilities[chain.id]) {
    return {
      paymasterServiceEnabled: false,
      atomicBatchEnabled: false,
      auxiliaryFundsEnabled: false,
    };
  }

  return {
    paymasterServiceEnabled:
      capabilities[chain.id]?.paymasterService?.supported,
    atomicBatchEnabled: capabilities[chain.id]?.atomicBatch?.supported,
    auxiliaryFundsEnabled: capabilities[chain.id]?.auxiliaryFunds?.supported,
  };
}
