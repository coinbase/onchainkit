import { http, cookieStorage, createConfig, createStorage } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';
import type { CreateWagmiConfigParams } from './types';

/**
 * Create a Wagmi configuration with default values for Coinbase Wallet.
 *
 * @param params - Configuration parameters
 * @param [params.apiKey] - Optional API key for Coinbase Developer Platform
 * @param [params.appName] - Optional application name for Coinbase Wallet
 * @param [params.appLogoUrl] - Optional application logo URL for Coinbase Wallet
 * @returns Wagmi configuration object
 */
export const createWagmiConfig = ({
  apiKey,
  appName,
  appLogoUrl,
}: CreateWagmiConfigParams) => {
  return createConfig({
    chains: [base, baseSepolia],
    connectors: [
      coinbaseWallet({
        appName,
        appLogoUrl,
        preference: 'all',
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
