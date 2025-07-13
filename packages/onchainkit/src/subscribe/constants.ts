// 🌲☀🌲
import type { Address } from 'viem';

/**
 * SpendPermissionManager contract address - deployed on multiple chains
 * @see https://github.com/coinbase/spend-permissions
 */
export const SPEND_PERMISSION_MANAGER_ADDRESS: Address =
  '0xf85210B21cC50302F477BA56686d2019dC9b67Ad';

/**
 * ETH token address for spend permissions (EIP-7528)
 * @see https://eips.ethereum.org/EIPS/eip-7528
 */
export const ETH_TOKEN_ADDRESS: Address =
  '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

/**
 * ERC-712 domain for SpendPermissionManager
 */
export const SPEND_PERMISSION_ERC712_DOMAIN = {
  name: 'Spend Permission Manager',
  version: '1',
} as const;

/**
 * ERC-712 types for SpendPermission
 */
export const SPEND_PERMISSION_ERC712_TYPES = {
  SpendPermission: [
    { name: 'account', type: 'address' },
    { name: 'spender', type: 'address' },
    { name: 'token', type: 'address' },
    { name: 'allowance', type: 'uint160' },
    { name: 'period', type: 'uint48' },
    { name: 'start', type: 'uint48' },
    { name: 'end', type: 'uint48' },
    { name: 'salt', type: 'uint256' },
    { name: 'extraData', type: 'bytes' },
  ],
} as const;

/**
 * Maximum uint48 value for unlimited subscription end time
 */
export const MAX_UINT48 = 281474976710655n;

/**
 * Time conversion constants
 */
export const TIME_UNITS = {
  SECOND: 1,
  MINUTE: 60,
  HOUR: 3600,
  DAY: 86400,
  WEEK: 604800,
  MONTH: 2592000,
  YEAR: 31536000,
} as const;

/**
 * Subscribe lifecycle status constants
 * Note: exported as public constants
 */
export const SUBSCRIBE_LIFECYCLE_STATUS = {
  INIT: 'init',
  LOADING: 'loading',
  SIGNING: 'signing',
  SUCCESS: 'success',
  SUBSCRIBED: 'subscribed',
  ERROR: 'error',
} as const;

/**
 * Type for subscribe lifecycle status values
 * Note: exported as public Type
 */
export type SubscribeLifecycleStatusName =
  (typeof SUBSCRIBE_LIFECYCLE_STATUS)[keyof typeof SUBSCRIBE_LIFECYCLE_STATUS];
