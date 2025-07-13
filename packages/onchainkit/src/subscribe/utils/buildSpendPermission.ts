// 🌲☀🌲
import type { Token } from '@/token';
import { parseUnits } from 'viem';
import type { Address, Hex } from 'viem';
import { ETH_TOKEN_ADDRESS, MAX_UINT48 } from '../constants';
import type { Duration, SpendPermission } from '../types';
import {
  calculateDurationInSeconds,
  calculatePeriodCount,
  calculateSubscriptionEnd,
} from './calculateDuration';
import {
  validateSubscriptionInterval,
  validateSubscriptionLength,
} from './validateDuration';

/**
 * Resolves token address for spend permissions
 * ETH uses the special EIP-7528 address, ERC-20s use their contract address
 */
function resolveTokenAddress(token: Token): Address {
  // ETH token has empty address, use EIP-7528 address for spend permissions
  if (token.address === '') {
    return ETH_TOKEN_ADDRESS;
  }
  return token.address as Address;
}

/**
 * Calculates the total allowance based on amount and subscription length
 * @param amount - Amount per period
 * @param token - Token object for decimals
 * @param interval - Period interval
 * @param subscriptionLength - Optional total subscription duration
 * @returns Total allowance in token units
 */
function calculateAllowance(
  amount: string,
  token: Token,
  interval: Duration,
  subscriptionLength?: Duration,
): bigint {
  const baseAmount = parseUnits(amount, token.decimals);

  // If no subscription length specified, use base amount per period
  // Note: This creates an unlimited subscription where the spender can collect
  // the base amount every period until the user revokes the permission
  if (!subscriptionLength) {
    return baseAmount;
  }

  // Calculate number of periods and multiply by base amount
  const periodCount = calculatePeriodCount(subscriptionLength, interval);
  return baseAmount * BigInt(periodCount);
}

/**
 * Build SpendPermission object from Subscribe component props
 * @param params - Parameters for building spend permission
 * @returns Complete SpendPermission object
 */
export function buildSpendPermission({
  account,
  spender,
  amount,
  token,
  interval,
  subscriptionLength,
  salt = BigInt(0),
  extraData = '0x' as Hex,
}: {
  account: Address;
  spender: Address;
  amount: string;
  token: Token;
  interval: Duration;
  subscriptionLength?: Duration;
  salt?: bigint | 'auto';
  extraData?: Hex;
}): SpendPermission {
  // Validate inputs
  validateSubscriptionInterval(interval);
  if (subscriptionLength) {
    validateSubscriptionLength(subscriptionLength, interval);
  }

  // Validate amount
  if (!amount || amount === '0') {
    throw new Error('Amount must be greater than 0');
  }

  // Handle salt - convert 'auto' to timestamp-based bigint
  const resolvedSalt = salt === 'auto' ? BigInt(Date.now()) : salt;

  // Calculate values
  const tokenAddress = resolveTokenAddress(token);
  const allowance = calculateAllowance(
    amount,
    token,
    interval,
    subscriptionLength,
  );
  const period = calculateDurationInSeconds(interval);
  const start = 0; // Always start immediately

  // Calculate end time
  let end: number;
  if (subscriptionLength) {
    end = calculateSubscriptionEnd(subscriptionLength, start);
  } else {
    // Use max uint48 for unlimited subscriptions
    // Note: MAX_UINT48 (281474976710655) is safely within JavaScript's MAX_SAFE_INTEGER
    // (9007199254740991), so this cast is safe. If the spec ever changes to uint64,
    // we should consider making SpendPermission.end a bigint in a breaking change.
    end = Number(MAX_UINT48);
  }

  return {
    account,
    spender,
    token: tokenAddress,
    allowance,
    period,
    start,
    end,
    salt: resolvedSalt,
    extraData,
  };
}

/**
 * Validates that a spend permission is properly formed
 * @param spendPermission - SpendPermission to validate
 */
export function validateSpendPermission(
  spendPermission: SpendPermission,
): void {
  if (!spendPermission.account || spendPermission.account === '0x0') {
    throw new Error('Account address is required');
  }

  if (!spendPermission.spender || spendPermission.spender === '0x0') {
    throw new Error('Spender address is required');
  }

  if (!spendPermission.token) {
    throw new Error('Token address is required');
  }

  if (spendPermission.allowance <= 0n) {
    throw new Error('Allowance must be greater than 0');
  }

  if (spendPermission.period <= 0) {
    throw new Error('Period must be greater than 0');
  }

  if (spendPermission.end <= spendPermission.start) {
    throw new Error('End time must be after start time');
  }
}
