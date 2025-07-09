import { createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';
import { http } from 'wagmi';

// Create a custom transport that doesn't intercept wallet-specific methods
const customTransport = http();

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: 'OnchainKit Playground',
      appLogoUrl: 'https://onchainkit.xyz/favicon.ico',
      preference: 'smartWalletOnly',
      // Don't override wallet-specific RPC methods
      overrides: {
        // Ensure wallet_getCapabilities is handled by the wallet
        wallet_getCapabilities: undefined,
      },
    }),
  ],
  transports: {
    [base.id]: customTransport,
    [baseSepolia.id]: customTransport,
  },
  ssr: true,
}); 