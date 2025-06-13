"use client";
import { useMiniKit, useAddFrame } from "@coinbase/onchainkit/minikit";
import { Button } from "../ui/Button";

export function AddFrame() {
  const { context } = useMiniKit();
  const addFrame = useAddFrame();

  return (
    <Button
      variant="primary"
      size="md"
      disabled={!context || context.client.added}
      onClick={addFrame}
    >
      Add Frame
    </Button>
  );
}
