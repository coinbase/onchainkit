import { PhantomConnector } from 'phantom-wagmi-connector';
import { http, cookieStorage, createConfig, createStorage } from 'wagmi';
import type { Connector, CreateConnectorFn } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';
import type { CreateWagmiConfigParams } from './types';

const phantomConnector: CreateConnectorFn = () => {
  return new PhantomConnector({
    chains: [base, baseSepolia],
  }) as unknown as Connector;
};

// createWagmiConfig returns a WagmiConfig (https://wagmi.sh/react/api/createConfig) using OnchainKit provided settings.
// This function should only be used if the user does not provide WagmiProvider as a parent in the React context.
export const createWagmiConfig = ({
  apiKey,
  appName,
  appLogoUrl,
}: CreateWagmiConfigParams) => {
  const chains = [base, baseSepolia] as const;

  return createConfig({
    chains,
    connectors: [
      coinbaseWallet({
        appName,
        appLogoUrl,
        preference: 'all',
      }),
      phantomConnector,
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
