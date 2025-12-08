'use client';
import { useMorphoVault } from '@/earn/hooks/useMorphoVault';
import { buildDepositToMorphoTx } from '@/earn/utils/buildDepositToMorphoTx';
import type { Call } from '@/transaction/types';
import { type Address, parseUnits } from 'viem';

export type UseBuildDepositToMorphoTxParams = {
  vaultAddress: Address;
  recipientAddress?: Address;
  amount: string;
};

/**
 * Generates Call[] for a Morpho deposit transaction
 * to be used with <Transaction />
 */
export function useBuildDepositToMorphoTx({
  vaultAddress,
  recipientAddress,
  amount,
}: UseBuildDepositToMorphoTxParams): {
  calls: Call[];
} {
  const { asset } = useMorphoVault({
    vaultAddress,
    recipientAddress,
  });

  if (!asset || !asset.decimals || !recipientAddress) {
    return {
      calls: [],
    };
  }

  const parsedAmount = parseUnits(amount, asset.decimals);

  const calls = buildDepositToMorphoTx({
    recipientAddress,
    vaultAddress,
    tokenAddress: asset.address,
    amount: parsedAmount,
  });

  return {
    calls,
  };
}
