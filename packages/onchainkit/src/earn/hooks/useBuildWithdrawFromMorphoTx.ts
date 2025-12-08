'use client';
import { useMorphoVault } from '@/earn/hooks/useMorphoVault';
import { buildWithdrawFromMorphoTx } from '@/earn/utils/buildWithdrawFromMorphoTx';
import type { Call } from '@/transaction/types';
import { type Address, parseUnits } from 'viem';

export type UseBuildWithdrawFromMorphoTxParams = {
  vaultAddress: Address;
  recipientAddress?: Address;
  amount: string;
  tokenDecimals: number | undefined;
};

/**
 * Generates Call[] for a Morpho withdraw transaction
 * to be used with <Transaction />
 */
export function useBuildWithdrawFromMorphoTx({
  vaultAddress,
  amount,
  recipientAddress,
  tokenDecimals,
}: UseBuildWithdrawFromMorphoTxParams): {
  calls: Call[];
} {
  const { asset, balance, vaultDecimals } = useMorphoVault({
    vaultAddress,
    recipientAddress,
  });

  const amountIsGreaterThanBalance = Number(amount) > Number(balance);

  if (
    !asset ||
    balance === undefined ||
    !vaultDecimals ||
    !recipientAddress ||
    amountIsGreaterThanBalance ||
    tokenDecimals === undefined
  ) {
    return {
      calls: [],
    };
  }

  const parsedAmount = parseUnits(amount, tokenDecimals);

  const calls = buildWithdrawFromMorphoTx({
    recipientAddress,
    vaultAddress,
    amount: parsedAmount,
  });

  return {
    calls,
  };
}
