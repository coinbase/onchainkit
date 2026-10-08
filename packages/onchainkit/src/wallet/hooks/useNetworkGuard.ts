import { useAccount, useSwitchChain } from 'wagmi';
import { useOnchainKit } from '@/useOnchainKit';

export function useNetworkGuard() {
  const { chain: targetChain } = useOnchainKit();
  const { chainId: connectedChainId, isConnected } = useAccount();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();

  const isWrongNetwork = isConnected && connectedChainId !== targetChain.id;

  const switchNetwork = async () => {
    if (!isWrongNetwork) return;
    await switchChainAsync({ chainId: targetChain.id });
  };

  return {
    isWrongNetwork,
    isSwitching,
    targetChain,
    connectedChainId,
    switchNetwork,
  };
}
