import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { Card, Code } from "@mantine/core";

export function Context() {
  const { context } = useMiniKit();

  return (
    <Card>
      <pre>
        <Code>{JSON.stringify(context ?? {}, null, 2)}</Code>
      </pre>
    </Card>
  );
}
