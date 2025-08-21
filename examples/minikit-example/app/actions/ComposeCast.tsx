"use client";
import { useComposeCast, useIsInMiniApp } from "@coinbase/onchainkit/minikit";
import { Button } from "@mantine/core";

export function ComposeCast() {
  const { isInMiniApp } = useIsInMiniApp();
  const { composeCast } = useComposeCast();

  return (
    <Button
      disabled={!isInMiniApp}
      onClick={() => {
        composeCast({
          text: "Hello, world!",
        });
      }}
    >
      Compose Cast
    </Button>
  );
}
