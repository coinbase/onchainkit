import { useMorphoVault } from '@/earn/hooks/useMorphoVault';
import { buildWithdrawFromMorphoTx } from '@/earn/utils/buildWithdrawFromMorphoTx';
import type { Call } from '@/transaction/types';
import { parseUnits, type Address } from 'viem';

export type UseBuildMorphoWithdrawTxParams = {
  vaultAddress: Address;
  receiverAddress: Address;
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
  console.log('amountIsGreaterThanBalance:', amountIsGreaterThanBalance);

  console.log('asset:', asset);
  console.log('balance:', balance);
  console.log('assetDecimals:', assetDecimals);
  console.log('vaultDecimals:', vaultDecimals);

  if (
    !asset ||
    balance === undefined ||
    !assetDecimals ||
    !vaultDecimals ||
    amountIsGreaterThanBalance
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
