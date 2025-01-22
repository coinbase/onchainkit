import { METAMORPHO_ABI, USDC_DECIMALS } from '@/earn/constants';
import type { Call } from '@/transaction/types';
import { encodeFunctionData, type Address, parseUnits } from 'viem';

type WithdrawFromMorphoArgs = {
  vaultAddress: Address;
  amount: number;
  receiverAddress: Address;
};

export async function buildWithdrawFromMorphoTx({
  vaultAddress,
  amount,
  receiverAddress,
}: WithdrawFromMorphoArgs): Promise<Call[]> {
  const amountInBigInt = parseUnits(amount.toString(), USDC_DECIMALS);
  const withdrawTxData = encodeFunctionData({
    abi: METAMORPHO_ABI,
    functionName: 'withdraw',
    args: [amountInBigInt, receiverAddress, receiverAddress],
  });

  return [
    {
      to: vaultAddress,
      data: withdrawTxData,
    },
  ];
}
