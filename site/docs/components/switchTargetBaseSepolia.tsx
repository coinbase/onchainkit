import { useSwitchChain, useAccount } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { useState, ReactNode } from "react";

type SwitchTargetBaseSepoliaProps = {
  children: (props: {
    isLoading: boolean;
    SwitchTargetBaseSepolia: () => Promise<void>;
  }) => ReactNode;
};

export default function SwitchTargetBaseSepolia({
  children,
}: SwitchTargetBaseSepoliaProps) {
  const { switchChain } = useSwitchChain();
  const { chain } = useAccount();
  const [isLoading, setIsLoading] = useState(false);

  const handleSwitchTargetBaseSepolia = async () => {
    setIsLoading(true);
    try {
      await switchChain({ chainId: baseSepolia.id });
    } catch (error) {
      console.error("switchTargetBaseSepolia:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render anything if already on Base Sepolia
  if (chain?.id === baseSepolia.id) {
    return null;
  }

  return children({
    isLoading,
    SwitchTargetBaseSepolia: handleSwitchTargetBaseSepolia,
  });
}
