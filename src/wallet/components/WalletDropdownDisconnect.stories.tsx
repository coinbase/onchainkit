import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { WalletDropdownDisconnect } from "./WalletDropdownDisconnect";
import { http, WagmiProvider, createConfig } from "wagmi";
import { baseSepolia } from "viem/chains";

const wagmiConfig = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
});

export default {
  title: "Wallet/WalletDropdownDisconnect",
  component: WalletDropdownDisconnect,
  decorators: [
    (Story) => (
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={new QueryClient()}>
          <Story />
        </QueryClientProvider>
      </WagmiProvider>
    ),
  ],
};

export const Default = () => <WalletDropdownDisconnect />;

export const CustomText = () => <WalletDropdownDisconnect text="Log Out" />;

export const CustomClass = () => (
  <WalletDropdownDisconnect className="bg-red-500" />
);
