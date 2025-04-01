import { ONCHAIN_KIT_CONFIG } from '@/core/OnchainKitConfig';

/**
 * Get the API key for OnchainKit.
 */
export const getApiKey = () => {
  if (!ONCHAIN_KIT_CONFIG.apiKey) {
    throw new Error(
      'API Key Unset: Please set the API Key by providing it in the `OnchainKitProvider` or by manually calling `setOnchainKitConfig`. For more information, visit: https://portal.cdp.coinbase.com/products/onchainkit',
    );
  }
  return ONCHAIN_KIT_CONFIG.apiKey;
};
