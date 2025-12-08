"use client";
import { useIsInMiniApp } from "@coinbase/onchainkit/minikit";
import { Text } from "@mantine/core";

export function IsInMiniApp() {
  const { isInMiniApp } = useIsInMiniApp();

  return <Text>Are we in a mini app? {isInMiniApp ? "Yes! 🎉" : "No 😢"}</Text>;
}
