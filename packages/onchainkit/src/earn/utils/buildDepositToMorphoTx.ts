import { MORPHO_VAULT_ABI } from '@/earn/abis/morpho';
import type { Call } from '@/transaction/types';
import { type Address, encodeFunctionData, erc20Abi } from 'viem';

export type DepositToMorphoParams = {
  /** The address of the Morpho vault */
  vaultAddress: Address;
  /** The address of the token to deposit */
  tokenAddress: Address;
  /** The amount of tokens to deposit */
  amount: bigint;
  /** The address which can withdraw the deposited tokens */
  recipientAddress: Address;
};

export function buildDepositToMorphoTx({
  vaultAddress,
  tokenAddress,
  amount,
  recipientAddress,
}: DepositToMorphoParams): Call[] {
  // User needs to approve the token they're depositing
  const approveTxData = encodeFunctionData({
    abi: erc20Abi,
    functionName: 'approve',
    args: [vaultAddress, amount],
  });

  // Once approved, user can deposit the token into the vault
  const depositTxData = encodeFunctionData({
    abi: MORPHO_VAULT_ABI,
    functionName: 'deposit',
    args: [amount, recipientAddress],
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
