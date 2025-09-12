import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { Card, Code, ScrollArea, Title } from "@mantine/core";

export function Context() {
  const { context } = useMiniKit();

  return (
    <Card>
      <Title size="lg" fw={600}>
        Mini app context
      </Title>
      <ScrollArea>
        <pre>
          <Code>{JSON.stringify(context ?? {}, null, 2)}</Code>
        </pre>
      </ScrollArea>
    </Card>
  );
}
