import { version } from '../version';

export const POST_METHOD = 'POST';
export const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'OnchainKit-Version': version,
};
export const JSON_RPC_VERSION = '2.0';
