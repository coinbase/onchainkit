"use client";
import { useClose, useIsInMiniApp } from "@coinbase/onchainkit/minikit";
import { Button } from "@mantine/core";

export function CloseFrame() {
  const { isInMiniApp } = useIsInMiniApp();
  const closeFrame = useClose();

  return (
    <Button disabled={!isInMiniApp} onClick={closeFrame}>
      Close Frame
    </Button>
  );
}
