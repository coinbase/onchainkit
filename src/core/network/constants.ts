import { version } from '../../version';

export const POST_METHOD = 'POST';
export const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'OnchainKit-Version': version,
};
export const CONTEXT_HEADER = 'OnchainKit-Context';
export const JSON_RPC_VERSION = '2.0';
export const ANALYTICS_API_URL = 'https://api.developer.coinbase.com/analytics';

/**
 * Internal - The context where the request originated
 *
 * @enum {string}
 * @readonly
 */
export enum REQUEST_CONTEXT {
  API = 'api',
  BUY = 'buy',
  CHECKOUT = 'checkout',
  HOOK = 'hook',
  NFT = 'nft',
  SWAP = 'swap',
  WALLET = 'wallet',
}
