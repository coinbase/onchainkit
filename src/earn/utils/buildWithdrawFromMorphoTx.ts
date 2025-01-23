import { MORPHO_VAULT_ABI } from '@/earn/abis/morpho';
import type { Call } from '@/transaction/types';
import { type Address, encodeFunctionData } from 'viem';

export type WithdrawFromMorphoArgs = {
  /** The address of the Morpho vault */
  vaultAddress: Address;
  /** The amount of tokens to withdraw */
  amount: bigint;
  /** The address to which the withdrawn funds will be sent */
  receiverAddress: Address;
};

export function buildWithdrawFromMorphoTx({
  vaultAddress,
  amount,
  receiverAddress,
}: WithdrawFromMorphoArgs): Call[] {
  const withdrawTxData = encodeFunctionData({
    abi: MORPHO_VAULT_ABI,
    functionName: 'withdraw',
    args: [amount, receiverAddress, receiverAddress],
  });

  return [
    {
      to: vaultAddress,
      data: withdrawTxData,
    },
  ];
}
