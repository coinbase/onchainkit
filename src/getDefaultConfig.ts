import { http, cookieStorage, createConfig, createStorage } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';
import type { AppConfig } from './types';

// getDefaultConfig returns a custom WagmiConfig (https://wagmi.sh/react/api/createConfig) using OnchainKit provided settings.
// This function is used if the user does not provide WagmiProvider as a parent in the React context.
export const getDefaultConfig = ({
  apiKey,
  config,
}: {
  apiKey?: string;
  config?: AppConfig;
}) => {
  return createConfig({
    chains: [base, baseSepolia],
    connectors: [
      coinbaseWallet({
        appName: config?.appearance?.name || 'My OnchainKit App',
        appLogoUrl:
          config?.appearance?.logo ||
          'https://onchainkit.xyz/favicon/48x48.png?v4-19-24',
        preference: 'smartWalletOnly',
      }),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [base.id]: apiKey
        ? http(`https://api.developer.coinbase.com/rpc/v1/base/${apiKey}`)
        : http(),
      [baseSepolia.id]: apiKey
        ? http(
            `https://api.developer.coinbase.com/rpc/v1/base-sepolia/${apiKey}`,
          )
        : http(),
    },
  });
};
