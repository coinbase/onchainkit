import { baseSepolia } from 'viem/chains';
import { OnchainKitConfig, SetOnchainKitConfig } from './types';

// The ONCHAIN_KIT_CONFIG is not exported at index.ts,
// but only acccessed through the get and set functions.
export const ONCHAIN_KIT_CONFIG: OnchainKitConfig = {
  address: null,
  apiKey: '',
  chain: baseSepolia,
  rpcUrl: '',
  schemaId: null,
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

/**
 * Access the RPC URL for OnchainKit.
 * Defaults to using Coinbase Developer Platform if a RPC URL is not provided.
 */
export const getRPCUrl = () => {
  if (!ONCHAIN_KIT_CONFIG.rpcUrl && !ONCHAIN_KIT_CONFIG.apiKey) {
    throw new Error(
      'RPC URL Unset: You can use the Coinbase Developer Platform RPC by providing an API key in `setOnchainKitConfig`: https://portal.cdp.coinbase.com/products/templates',
    );
  }
  return (
    ONCHAIN_KIT_CONFIG.rpcUrl ||
    `https://api.developer.coinbase.com/rpc/v1/${ONCHAIN_KIT_CONFIG.chain.name.replace(' ', '-').toLowerCase()}/${ONCHAIN_KIT_CONFIG.apiKey}`
  );
};
