import { useMorphoVault } from '@/earn/hooks/useMorphoVault';
import { buildDepositToMorphoTx } from '@/earn/utils/buildDepositToMorphoTx';
import type { Call } from '@/transaction/types';
import { type Address, parseUnits } from 'viem';

export type UseBuildMorphoDepositTxParams = {
  vaultAddress: Address;
  receiverAddress?: Address;
  amount: number;
};

/**
 * Generates Call[] for a Morpho deposit transaction
 * to be used with <Transaction />
 */
export function useBuildMorphoDepositTx({
  vaultAddress,
  receiverAddress,
  amount,
}: UseBuildMorphoDepositTxParams): {
  calls: Call[];
} {
  const { asset, assetDecimals } = useMorphoVault({
    vaultAddress,
    address: receiverAddress,
  });

  if (!asset || !assetDecimals || !receiverAddress) {
    return {
      calls: [],
    };
  }

  const parsedAmount = parseUnits(amount.toString(), assetDecimals);

  const calls = buildDepositToMorphoTx({
    receiverAddress,
    vaultAddress,
    tokenAddress: asset,
    amount: parsedAmount,
  });

  return {
    calls,
  };
}
