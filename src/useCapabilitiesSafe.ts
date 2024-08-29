import { Chain } from 'viem';
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

  const atomicBatchEnabled =
    (capabilities && capabilities[chain.id]?.atomicBatch?.supported === true) ??
    false;
  const paymasterServiceEnabled =
    (capabilities &&
      capabilities[chain.id]?.paymasterService?.supported === true) ??
    false;
  const auxiliaryFundsEnabled =
    (capabilities &&
      capabilities[chain.id]?.auxiliaryFunds?.supported === true) ??
    false;

  return {
    paymaster: paymasterServiceEnabled,
    batching: atomicBatchEnabled,
    funding: auxiliaryFundsEnabled,
  };
}
