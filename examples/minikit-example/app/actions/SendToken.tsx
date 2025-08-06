"use client";
import { useSendToken, useIsInMiniApp } from "@coinbase/onchainkit/minikit";
import { Button } from "../ui/Button";

export function SendToken() {
  const { isInMiniApp } = useIsInMiniApp();
  const { sendToken } = useSendToken();

  return (
    <Button
      disabled={!isInMiniApp}
      onClick={() => {
        sendToken({
          token: "eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // Base USDC
          amount: "1000000", // 1 USDC (6 decimals)
          recipientAddress: "0xfa6b3dF826636Eb76E23C1Ee38180dB3b8f60a86", // Example recipient address
        });
      }}
    >
      Send Token
    </Button>
  );
}
