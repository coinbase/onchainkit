import { version } from '../../version';

export const POST_METHOD = 'POST';
export const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'OnchainKit-Version': version,
};
export const JSON_RPC_VERSION = '2.0';
export const ANALYTICS_API_URL = 'https://api.developer.coinbase.com/analytics';
