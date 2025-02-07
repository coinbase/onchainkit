import { useMorphoVault } from '@/earn/hooks/useMorphoVault';
import { buildWithdrawFromMorphoTx } from '@/earn/utils/buildWithdrawFromMorphoTx';
import type { Call } from '@/transaction/types';
import { type Address, parseUnits } from 'viem';

export type UseBuildMorphoWithdrawTxParams = {
  vaultAddress: Address;
  receiverAddress?: Address;
  amount: string;
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
  const { asset, balance, vaultDecimals } = useMorphoVault({
    vaultAddress,
    address: receiverAddress,
  });

  const amountIsGreaterThanBalance = Number(amount) > Number(balance);

  if (
    !asset ||
    balance === undefined ||
    !vaultDecimals ||
    amountIsGreaterThanBalance ||
    !receiverAddress
  ) {
    return {
      calls: [],
    };
  }

  const parsedAmount = parseUnits(amount, vaultDecimals);

  const calls = buildWithdrawFromMorphoTx({
    receiverAddress,
    vaultAddress,
    amount: parsedAmount,
  });

  return {
    calls,
  };
}
