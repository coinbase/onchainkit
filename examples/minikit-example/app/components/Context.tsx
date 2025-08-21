import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { Card, Code, ScrollArea } from "@mantine/core";

export function Context() {
  const { context } = useMiniKit();

  return (
    <Card>
      <ScrollArea>
        <pre>
          <Code>{JSON.stringify(context ?? {}, null, 2)}</Code>
        </pre>
      </ScrollArea>
    </Card>
  );
}
