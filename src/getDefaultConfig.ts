import { http, cookieStorage, createConfig, createStorage } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';
import type { AppConfiguration } from './types';

export const getDefaultConfig = ({
  apiKey,
  config,
}: {
  apiKey?: string;
  config?: AppConfiguration;
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
