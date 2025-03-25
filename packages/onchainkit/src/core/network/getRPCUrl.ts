import { ONCHAIN_KIT_CONFIG } from '../OnchainKitConfig';

/**
 * Access the RPC URL for OnchainKit.
 * Defaults to using Coinbase Developer Platform if an RPC URL is not provided.
 */
export const getRPCUrl = () => {
  if (!ONCHAIN_KIT_CONFIG.rpcUrl && !ONCHAIN_KIT_CONFIG.apiKey) {
    throw new Error(
      'API Key Unset: You can use the Coinbase Developer Platform RPC by providing an API key in `OnchainKitProvider` or by manually calling `setOnchainKitConfig`: https://portal.cdp.coinbase.com/products/onchainkit',
    );
  }
  return (
    ONCHAIN_KIT_CONFIG.rpcUrl ||
    `https://api.developer.coinbase.com/rpc/v1/${ONCHAIN_KIT_CONFIG.chain.name.replace(' ', '-').toLowerCase()}/${ONCHAIN_KIT_CONFIG.apiKey}`
  );
};
