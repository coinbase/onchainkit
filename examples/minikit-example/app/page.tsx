"use client";
import { useMiniKit, useOpenUrl } from "@coinbase/onchainkit/minikit";
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useEffect } from "react";
import { IsInMiniApp } from "./actions/IsInMiniApp";
import { AddFrame } from "./actions/AddFrame";
import { ComposeCast } from "./actions/ComposeCast";
import { ViewCast } from "./actions/ViewCast";
import { CloseFrame } from "./actions/CloseFrame";
import { UserInfo } from "./components/UserInfo";
import { SendToken } from "./actions/SendToken";
import { SwapToken } from "./actions/SwapToken";
import { BatchedTransaction } from "./actions/BatchedTransaction";
import { Anchor, Flex, Stack, Text, Title } from "@mantine/core";
import { Context } from "./components/Context";

export default function App() {
  const { setFrameReady, isFrameReady } = useMiniKit();
  const openUrl = useOpenUrl();

  const safeAreaInsets = (() => {
    if (typeof window === "undefined") {
      return { top: "", right: "", bottom: "", left: "" };
    }
    const styles = getComputedStyle(document.documentElement);
    return {
      top: styles.getPropertyValue("--ock-minikit-safe-area-inset-top").trim(),
      right: styles
        .getPropertyValue("--ock-minikit-safe-area-inset-right")
        .trim(),
      bottom: styles
        .getPropertyValue("--ock-minikit-safe-area-inset-bottom")
        .trim(),
      left: styles
        .getPropertyValue("--ock-minikit-safe-area-inset-left")
        .trim(),
    };
  })();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  return (
    <Stack p="md">
      <Flex component="header" align="end" justify="end" mb="xl">
        <Wallet>
          <ConnectWallet />
          <WalletDropdown>
            <Identity hasCopyAddressOnClick>
              <Avatar />
              <Name />
              <Address />
              <EthBalance />
            </Identity>
            <WalletDropdownDisconnect />
          </WalletDropdown>
        </Wallet>
      </Flex>

      <Stack component="main" justify="center" align="center" gap="md">
        <Title order={1}>MiniKit Examples</Title>

        <Text>
          This mini app is meant to show how you can use the actions available
          in MiniKit.
        </Text>

        <Stack maw="100%">
          <IsInMiniApp />
          <UserInfo />
          <AddFrame />
          <ComposeCast />
          <ViewCast />
          <SendToken />
          <SwapToken />
          <CloseFrame />
          <BatchedTransaction />
          <Context />
          <Stack>
            <Title order={3}>Safe Area Insets (:root)</Title>
            <Text>
              --ock-minikit-safe-area-inset-top: {safeAreaInsets.top || "N/A"}
            </Text>
            <Text>
              --ock-minikit-safe-area-inset-right:{" "}
              {safeAreaInsets.right || "N/A"}
            </Text>
            <Text>
              --ock-minikit-safe-area-inset-bottom:{" "}
              {safeAreaInsets.bottom || "N/A"}
            </Text>
            <Text>
              --ock-minikit-safe-area-inset-left: {safeAreaInsets.left || "N/A"}
            </Text>
          </Stack>
        </Stack>
      </Stack>

      <Text ta="center" mt="xl">
        Built on Base with{" "}
        <Anchor
          href="https://base.org/builders/minikit"
          onClick={(e) => {
            e.preventDefault();
            openUrl("https://base.org/builders/minikit");
          }}
        >
          MiniKit
        </Anchor>
      </Text>
    </Stack>
  );
}
