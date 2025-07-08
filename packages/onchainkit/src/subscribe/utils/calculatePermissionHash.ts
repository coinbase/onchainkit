import { hashTypedData } from 'viem';
import type { SpendPermission } from '../types';
import type { Address, Hex } from 'viem';
import {
  SPEND_PERMISSION_ERC712_DOMAIN,
  SPEND_PERMISSION_ERC712_TYPES,
  SPEND_PERMISSION_MANAGER_ADDRESS,
} from '../constants';

/**
 * Flexible SpendPermission type that can handle both bigint and string values
 * This is useful when working with RPC responses that return strings
 */
export type FlexibleSpendPermission = {
  account: Address;
  spender: Address;
  token: Address;
  allowance: bigint | string;
  period: number;
  start: number;
  end: number;
  salt: bigint | string;
  extraData: Hex;
};

/**
 * Calculate the EIP-712 typed data hash for a SpendPermission
 * This matches the hash calculation used by the SpendPermissionManager contract's getHash function
 * @param spendPermission - The SpendPermission to hash (accepts both bigint and string values)
 * @param chainId - The chain ID for the domain separator
 * @returns The permission hash as a hex string
 */
export function calculatePermissionHash(
  spendPermission: SpendPermission | FlexibleSpendPermission,
  chainId: number,
): string {
  try {
    // Normalize the spend permission to ensure correct types
    const normalizedPermission = {
      account: spendPermission.account,
      spender: spendPermission.spender,
      token: spendPermission.token,
      allowance:
        typeof spendPermission.allowance === 'string'
          ? BigInt(spendPermission.allowance)
          : spendPermission.allowance,
      period: Number(spendPermission.period),
      start: Number(spendPermission.start),
      end: Number(spendPermission.end),
      salt:
        typeof spendPermission.salt === 'string'
          ? BigInt(spendPermission.salt)
          : spendPermission.salt,
      extraData: spendPermission.extraData,
    };

    // Use EIP-712 typed data hashing, same as the contract's _hashTypedData()
    // This follows the same pattern as the contract's getHash function
    const hash = hashTypedData({
      domain: {
        ...SPEND_PERMISSION_ERC712_DOMAIN,
        chainId,
        verifyingContract: SPEND_PERMISSION_MANAGER_ADDRESS,
      },
      types: SPEND_PERMISSION_ERC712_TYPES,
      primaryType: 'SpendPermission',
      message: normalizedPermission,
    });

    return hash;
  } catch (error) {
    throw new Error(`Failed to calculate permission hash: ${error}`);
  }
}
