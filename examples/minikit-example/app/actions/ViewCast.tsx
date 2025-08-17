"use client";
import { useViewCast, useIsInMiniApp } from "@coinbase/onchainkit/minikit";
import { Button } from "@mantine/core";

export function ViewCast() {
  const { isInMiniApp } = useIsInMiniApp();
  const { viewCast } = useViewCast();

  return (
    <Button
      disabled={!isInMiniApp}
      onClick={() => {
        viewCast({
          hash: "0x4cdc3e6dbeb85e472e626c695725eee815b38ea4",
        });
      }}
    >
      View Cast
    </Button>
  );
}
