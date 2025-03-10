import { http, cookieStorage, createConfig, createStorage } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';
import type { CreateWagmiConfigParams } from './types';

/**
 * createWagmiConfig returns a WagmiConfig (https://wagmi.sh/react/api/createConfig) using OnchainKit provided settings.
 * This function should only be used if the user does not provide WagmiProvider as a parent in the React context.
 */
export const createWagmiConfig = ({
  apiKey,
  appName,
  appLogoUrl,
  connectors = [
    coinbaseWallet({
      appName,
      appLogoUrl,
      preference: 'all',
    }),
  ],
}: CreateWagmiConfigParams) => {
  return createConfig({
    chains: [base, baseSepolia],
    connectors,
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
