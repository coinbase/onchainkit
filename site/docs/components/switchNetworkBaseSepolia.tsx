import { useSwitchChain, useAccount } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { useState, ReactNode } from "react";

type SwitchNetworkBaseSepoliaProps = {
  children: (props: {
    isLoading: boolean;
    SwitchNetworkBaseSepolia: () => Promise<void>;
  }) => ReactNode;
};

export default function SwitchNetworkBaseSepolia({
  children,
}: SwitchNetworkBaseSepoliaProps) {
  const { switchChain } = useSwitchChain();
  const { chain, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);

  const handleSwitchNetworkBaseSepolia = async () => {
    setIsLoading(true);
    try {
      await switchChain({ chainId: baseSepolia.id });
    } catch (error) {
      console.error("switchNetworkBaseSepolia:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render anything if the wallet is not connected or already on Base Sepolia
  if (!isConnected || chain?.id === baseSepolia.id) {
    return null;
  }

  return children({
    isLoading,
    SwitchNetworkBaseSepolia: handleSwitchNetworkBaseSepolia,
  });
}