import type { Chain } from 'viem';
import { getChainPublicClient } from '../../core/network/getChainPublicClient';
import { SPEND_PERMISSION_MANAGER_ADDRESS } from '../constants';
import type { PeriodSpend, SpendPermission } from '../types';

/**
 * ABI for the getCurrentPeriod function on SpendPermissionManager
 */
const GET_CURRENT_PERIOD_ABI = [
  {
    name: 'getCurrentPeriod',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      {
        name: 'spendPermission',
        type: 'tuple',
        components: [
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
      },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'start', type: 'uint48' },
          { name: 'end', type: 'uint48' },
          { name: 'spend', type: 'uint160' },
        ],
      },
    ],
  },
] as const;

/**
 * ABI for contract status check functions
 */
const PERMISSION_STATUS_ABI = [
  {
    name: 'isApproved',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      {
        name: 'spendPermission',
        type: 'tuple',
        components: [
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
      },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'isRevoked',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      {
        name: 'spendPermission',
        type: 'tuple',
        components: [
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
      },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const;

/**
 * Fetch current period information for a spend permission
 * @param spendPermission - The spend permission to check
 * @param chain - Chain to query
 * @returns Current period information
 */
export async function getCurrentPeriod(
  spendPermission: SpendPermission,
  chain: Chain,
): Promise<PeriodSpend> {
  const client = getChainPublicClient(chain);

  const result = await client.readContract({
    address: SPEND_PERMISSION_MANAGER_ADDRESS,
    abi: GET_CURRENT_PERIOD_ABI,
    functionName: 'getCurrentPeriod',
    args: [spendPermission],
  });

  return {
    start: Number(result.start),
    end: Number(result.end),
    spend: result.spend,
  };
}

/**
 * Check if a spend permission is approved
 * @param spendPermission - The spend permission to check
 * @param chain - Chain to query
 * @returns Whether the permission is approved
 *
 * Note: This function makes a contract call and may be redundant if the permission
 * was fetched via coinbase_fetchPermissions, which only returns approved permissions.
 */
export async function isPermissionApproved(
  spendPermission: SpendPermission,
  chain: Chain,
): Promise<boolean> {
  const client = getChainPublicClient(chain);

  const result = await client.readContract({
    address: SPEND_PERMISSION_MANAGER_ADDRESS,
    abi: PERMISSION_STATUS_ABI,
    functionName: 'isApproved',
    args: [spendPermission],
  });

  return result;
}

/**
 * Check if a spend permission is revoked
 * @param spendPermission - The spend permission to check
 * @param chain - Chain to query
 * @returns Whether the permission is revoked
 *
 * Note: This function makes a contract call and may be redundant if the permission
 * was fetched via coinbase_fetchPermissions, which filters out revoked permissions.
 */
export async function isPermissionRevoked(
  spendPermission: SpendPermission,
  chain: Chain,
): Promise<boolean> {
  const client = getChainPublicClient(chain);

  const result = await client.readContract({
    address: SPEND_PERMISSION_MANAGER_ADDRESS,
    abi: PERMISSION_STATUS_ABI,
    functionName: 'isRevoked',
    args: [spendPermission],
  });

  return result;
}

/**
 * Get current period information for a spend permission
 * @param spendPermission - The spend permission to check
 * @param chain - Chain to query
 * @returns Current period information if available
 *
 * Note: This function only fetches current period data since coinbase_fetchPermissions
 * already filters to only include active (approved and not revoked) permissions.
 */
export async function getPermissionStatus(
  spendPermission: SpendPermission,
  chain: Chain,
) {
  try {
    const currentPeriod = await getCurrentPeriod(spendPermission, chain);
    return { currentPeriod };
  } catch {
    // If getCurrentPeriod fails, the permission might not exist or be outside valid time range
    // This is not critical since components don't use this data for display
    return { currentPeriod: undefined };
  }
}
