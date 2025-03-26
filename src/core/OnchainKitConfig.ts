import { baseSepolia } from 'viem/chains';
import type { OnchainKitConfig, SetOnchainKitConfig } from './types';

/**
 * The ONCHAIN_KIT_CONFIG is not exported at index.ts,
 * but only accessed through the get and set functions.
 */
export const ONCHAIN_KIT_CONFIG: OnchainKitConfig = {
  address: null,
  apiKey: null,
  chain: baseSepolia,
  config: {
    analytics: true,
    analyticsUrl: null,
    appearance: {
      name: null,
      logo: null,
      mode: null,
      theme: null,
    },
    paymaster: null,
    wallet: {
      display: null,
      termsUrl: null,
      privacyUrl: null,
      supportedWallets: {
        rabby: false,
        trust: false,
        frame: false,
      },
    },
  },
  rpcUrl: null,
  schemaId: null,
  projectId: null,
  sessionId: null,
};

/**
 * Access the ONCHAIN_KIT_CONFIG object directly by providing the key.
 * This is powerful when you use OnchainKit utilities outside of the React context.
 */
export const getOnchainKitConfig = <K extends keyof typeof ONCHAIN_KIT_CONFIG>(
  configName: K,
): (typeof ONCHAIN_KIT_CONFIG)[K] => {
  return ONCHAIN_KIT_CONFIG[configName];
};

/**
 * Update the ONCHAIN_KIT_CONFIG object directly by providing the properties to update.
 * This is powerful when you use OnchainKit utilities outside of the React context.
 */
export const setOnchainKitConfig = (properties: SetOnchainKitConfig) => {
  Object.assign(ONCHAIN_KIT_CONFIG, properties);
  return getOnchainKitConfig;
};
