import { MORPHO_VAULT_ABI } from '@/earn/abis/morpho';
import type { Call } from '@/transaction/types';
import { type Address, encodeFunctionData, decodeFunctionData } from 'viem';

export type WithdrawFromMorphoParams = {
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
}: WithdrawFromMorphoParams): Call[] {
  console.log('amount:', amount);
  const withdrawTxData = encodeFunctionData({
    abi: MORPHO_VAULT_ABI,
    functionName: 'redeem', // redeem is the number of *shares*, withdraw is the number of *assets*
    args: [amount, receiverAddress, receiverAddress],
  });

  // decode for testing
  const decoded = decodeFunctionData({
    abi: MORPHO_VAULT_ABI,
    data: withdrawTxData,
  });
  console.log('decoded:', decoded);

  return [
    {
      to: vaultAddress,
      data: withdrawTxData,
    },
  ];
}
