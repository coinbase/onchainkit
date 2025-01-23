import { useMorphoVault } from '@/earn/hooks/useMorphoVault';
import { buildDepositToMorphoTx } from '@/earn/utils/buildDepositToMorphoTx';
import type { Call } from '@/transaction/types';
import { parseUnits, type Address, formatUnits } from 'viem';

/**
 * Generates Call[] for a Morpho deposit transaction
 * to be used with <Transaction />
 */
export function useBuildMorphoDepositTx({
  vaultAddress,
  receiverAddress,
  amount,
}: { vaultAddress: Address; receiverAddress: Address; amount: number }): {
  calls: Call[];
} {
  const { asset, balance, assetDecimals } = useMorphoVault({
    vaultAddress,
    address: receiverAddress,
  });

  if (!asset || balance === undefined || !assetDecimals) {
    return {
      calls: [],
    };
  }

  const parsedAmount = parseUnits(amount.toString(), assetDecimals);
  console.log('parsedAmount:', parsedAmount);

  console.log('formatted amoutn:', formatUnits(parsedAmount, assetDecimals));

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
