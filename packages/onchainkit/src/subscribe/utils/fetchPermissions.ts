import type { Address } from 'viem';
import type {
  FetchPermissionsRequest,
  FetchPermissionsResult,
  FetchPermissionsResultItem,
} from '../types';

/**
 * Fetches active spend permissions for a user from Coinbase Wallet
 */
export async function fetchPermissions({
  chainId,
  account,
  spender,
  pageOptions,
}: FetchPermissionsRequest): Promise<FetchPermissionsResult> {
  const response = await fetch('https://rpc.wallet.coinbase.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'coinbase_fetchPermissions',
      params: [
        {
          account,
          chainId,
          spender,
          ...(pageOptions && { pageOptions }),
        },
      ],
      id: 1,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch permissions: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message || 'Failed to fetch permissions');
  }

  return data.result;
}

/**
 * Checks if there's an active permission that matches the given criteria
 */
export function hasMatchingPermission(
  permissions: FetchPermissionsResultItem[],
  targetToken: Address,
  targetPeriod: number,
  targetAllowance: bigint,
): FetchPermissionsResultItem | null {
  return (
    permissions.find((permission) => {
      const { spendPermission } = permission;
      return (
        spendPermission.token.toLowerCase() === targetToken.toLowerCase() &&
        spendPermission.period === targetPeriod &&
        BigInt(spendPermission.allowance) >= targetAllowance
      );
    }) || null
  );
}
