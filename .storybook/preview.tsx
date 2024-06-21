import React from "react";
import type { Preview } from "@storybook/react";
import { createConfig, http, WagmiProvider } from "wagmi";
import { coinbaseWallet } from "wagmi/connectors";
import { base } from "viem/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { withPerformance } from "storybook-addon-performance";

import "../src/styles.css";

const queryClient = new QueryClient();

const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      // @ts-ignore
      appChainIds: [base.id],
      appName: "onchainkit",
    }),
  ],
  ssr: true,
  transports: {
    [base.id]: http(),
  },
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    withPerformance,
    (Story) => (
      <div>
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <Story />
          </QueryClientProvider>
        </WagmiProvider>
      </div>
    ),
  ],
};

export default preview;
