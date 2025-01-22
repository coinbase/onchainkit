import { METAMORPHO_ABI } from '@/earn/constants';
import type { Call } from '@/transaction/types';
import { type Address, encodeFunctionData, erc20Abi } from 'viem';

type DepositToMorphoArgs = {
  vaultAddress: Address;
  tokenAddress: Address;
  amount: bigint;
  receiverAddress: Address;
};

export function buildDepositToMorphoTx({
  vaultAddress,
  tokenAddress,
  amount,
  receiverAddress,
}: DepositToMorphoArgs): Call[] {
  // User needs to approve the token they're depositing
  const approveTxData = encodeFunctionData({
    abi: erc20Abi,
    functionName: 'approve',
    args: [vaultAddress, amount],
  });

  // Once approved, user can deposit the token into the vault
  const depositTxData = encodeFunctionData({
    abi: METAMORPHO_ABI,
    functionName: 'deposit',
    args: [amount, receiverAddress],
  });

  return [
    {
      to: tokenAddress,
      data: approveTxData,
    },
    {
      to: vaultAddress,
      data: depositTxData,
    },
  ];
}
