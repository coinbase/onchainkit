import { version } from '../version';

export const CDP_LIST_SWAP_ASSETS = 'cdp_listSwapAssets';
export const CDP_GET_SWAP_QUOTE = 'cdp_getSwapQuote';
export const CDP_GET_SWAP_TRADE = 'cdp_getSwapTrade';
export const CDP_HYDRATE_CHARGE = 'cdp_hydrateCharge';
export const CDP_CREATE_PRODUCT_CHARGE = 'cdp_createProductCharge';

export const POST_METHOD = 'POST';
export const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'OnchainKit-Version': version,
};
export const JSON_RPC_VERSION = '2.0';
