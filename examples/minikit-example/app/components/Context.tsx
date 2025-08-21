import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { Card, Code } from "@mantine/core";

export function Context() {
  const { context } = useMiniKit();

  return (
    <Card>
      <Code>{JSON.stringify(context ?? {}, null, 2)}</Code>
    </Card>
  );
}
