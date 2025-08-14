"use client";
import { useSwapToken, useIsInMiniApp } from "@coinbase/onchainkit/minikit";
import { Button } from "../ui/Button";

export function SwapToken() {
  const { isInMiniApp } = useIsInMiniApp();
  const { swapToken } = useSwapToken();

  return (
    <Button
      disabled={!isInMiniApp}
      onClick={() => {
        swapToken({
          sellToken:
            "eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // Base USDC
          buyToken: "eip155:8453/native", // Base ETH
          sellAmount: "1000000", // 1 USDC (6 decimals)
        });
      }}
    >
      Swap Token
    </Button>
  );
}
