import { version } from '@/version';

export const POST_METHOD = 'POST';
export const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'OnchainKit-Version': version,
};
export const CONTEXT_HEADER = 'OnchainKit-Context';
export const JSON_RPC_VERSION = '2.0';

/**
 * Internal - The context where the request originated
 *
 * @enum {string}
 * @readonly
 */
export enum RequestContext {
  API = 'api',
  Buy = 'buy',
  Checkout = 'checkout',
  Hook = 'hook',
  NFT = 'nft',
  Swap = 'swap',
  Wallet = 'wallet',
}
