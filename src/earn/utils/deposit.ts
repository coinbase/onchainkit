import { METAMORPHO_ABI, USDC_DECIMALS } from '@/earn/constants';
import type { Call } from '@/transaction/types';
import { encodeFunctionData, type Address, erc20Abi, parseUnits } from 'viem';

type DepositToMorphoArgs = {
  vaultAddress: Address;
  tokenAddress: Address;
  amount: number;
  receiverAddress: Address;
};

export function buildDepositToMorphoTx({
  vaultAddress,
  tokenAddress,
  amount,
  receiverAddress,
}: DepositToMorphoArgs): Call[] {
  // Convert amount to BigInt, adjusted for token decimals
  // May want to make this more generic in the future (fetch token decimals from chain or allow user to pass it in)
  const amountInBigInt = parseUnits(amount.toString(), USDC_DECIMALS);

  // User needs to approve the token they're depositing
  const approveTxData = encodeFunctionData({
    abi: erc20Abi,
    functionName: 'approve',
    args: [vaultAddress, amountInBigInt],
  });

  // Once approved, user can deposit the token into the vault
  const depositTxData = encodeFunctionData({
    abi: METAMORPHO_ABI,
    functionName: 'deposit',
    args: [amountInBigInt, receiverAddress],
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
