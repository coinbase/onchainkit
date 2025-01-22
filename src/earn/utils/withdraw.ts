import { METAMORPHO_ABI } from '@/earn/constants';
import type { Call } from '@/transaction/types';
import { type Address, encodeFunctionData } from 'viem';

type WithdrawFromMorphoArgs = {
  vaultAddress: Address;
  amount: bigint;
  receiverAddress: Address;
};

export async function buildWithdrawFromMorphoTx({
  vaultAddress,
  amount,
  receiverAddress,
}: WithdrawFromMorphoArgs): Promise<Call[]> {
  const withdrawTxData = encodeFunctionData({
    abi: METAMORPHO_ABI,
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
