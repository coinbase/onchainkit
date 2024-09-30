import { type ContractFunctionParameters, erc20Abi } from 'viem';
import type { PayTransaction } from '../../api/types';
import { COMMERCE_ABI } from '../constants';

export function getCommerceContracts({
  transaction,
}: {
  transaction: PayTransaction;
}): ContractFunctionParameters[] {
  const { callData, metaData } = transaction;

  return [
    {
      address: callData.recipientCurrency,
      abi: erc20Abi,
      functionName: 'approve',
      args: [
        metaData.contractAddress,
        BigInt(callData.recipientAmount) + BigInt(callData.feeAmount),
      ],
    },
    {
      address: metaData.contractAddress,
      abi: COMMERCE_ABI,
      functionName: 'transferTokenPreApproved',
      args: [
        {
          id: callData.id,
          recipientAmount: BigInt(callData.recipientAmount),
          deadline: BigInt(
            Math.floor(new Date(callData.deadline).getTime() / 1000),
          ),
          recipient: callData.recipient,
          recipientCurrency: callData.recipientCurrency,
          refundDestination: callData.refundDestination,
          feeAmount: BigInt(callData.feeAmount),
          operator: callData.operator,
          signature: callData.signature,
          prefix: callData.prefix,
        },
      ],
    },
  ];
}
