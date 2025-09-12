"use client";
import { useMiniKit, useAddFrame } from "@coinbase/onchainkit/minikit";
import { Button } from "@mantine/core";

export function AddFrame() {
  const { context } = useMiniKit();
  const addFrame = useAddFrame();

  return (
    <Button disabled={!context || context.client.added} onClick={addFrame}>
      Add Frame
    </Button>
  );
}
