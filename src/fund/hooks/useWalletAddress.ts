import { useOnchainKit } from '@/useOnchainKit';
import { useAccount } from 'wagmi';

export const useWalletAddress = ({
  walletAddress,
  walletNetwork,
}: {
  walletAddress?: string;
  walletNetwork?: string;
}) => {
  const { chain: defaultChain } = useOnchainKit();
  const { address: wagmiAddress, chain: accountChain } = useAccount();

  const chain = accountChain || defaultChain;
  const network = walletNetwork || chain.name.toLowerCase();

  const address = walletAddress || wagmiAddress;

  return { address, network };
};
