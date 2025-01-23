import { useMorphoVault } from '@/earn/hooks/useMorphoVault';
import { buildWithdrawFromMorphoTx } from '@/earn/utils/buildWithdrawFromMorphoTx';
import type { Call } from '@/transaction/types';
import { parseUnits, type Address } from 'viem';

/**
 * Generates Call[] for a Morpho withdraw transaction
 * to be used with <Transaction />
 */
export function useBuildMorphoDepositTx({
  vaultAddress,
  amount,
  receiverAddress,
}: { vaultAddress: Address; receiverAddress: Address; amount: number }): {
  calls: Call[];
} {
  const { asset, balance, decimals } = useMorphoVault({
    vaultAddress,
    address: receiverAddress,
  });

  if (!asset || balance === undefined || !decimals) {
    return {
      calls: [],
    };
  }

  const parsedAmount = parseUnits(amount.toString(), decimals);

  const calls = buildWithdrawFromMorphoTx({
    receiverAddress,
    vaultAddress,
    amount: parsedAmount,
  });

  return {
    calls,
  };
}
