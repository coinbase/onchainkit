import { useMorphoVault } from '@/earn/hooks/useMorphoVault';
import { buildWithdrawFromMorphoTx } from '@/earn/utils/buildWithdrawFromMorphoTx';
import type { Call } from '@/transaction/types';
import { type Address, parseUnits } from 'viem';

export type UseBuildMorphoWithdrawTxParams = {
  vaultAddress: Address;
  receiverAddress?: Address;
  amount: number;
};

/**
 * Generates Call[] for a Morpho withdraw transaction
 * to be used with <Transaction />
 */
export function useBuildMorphoWithdrawTx({
  vaultAddress,
  amount,
  receiverAddress,
}: UseBuildMorphoWithdrawTxParams): {
  calls: Call[];
} {
  const { asset, balance, assetDecimals, vaultDecimals } = useMorphoVault({
    vaultAddress,
    address: receiverAddress,
  });

  const amountIsGreaterThanBalance = amount > Number(balance);

  if (
    !asset ||
    balance === undefined ||
    !assetDecimals ||
    !vaultDecimals ||
    amountIsGreaterThanBalance ||
    !receiverAddress
  ) {
    return {
      calls: [],
    };
  }

  const parsedAmount = parseUnits(amount.toString(), assetDecimals);

  const calls = buildWithdrawFromMorphoTx({
    receiverAddress,
    vaultAddress,
    amount: parsedAmount,
  });

  return {
    calls,
  };
}
