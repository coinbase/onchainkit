import { type ContractFunctionParameters, erc20Abi } from 'viem';
import { COMMERCE_ABI, CONTRACT_METHODS } from '../constants';
import type { GetCommerceContractsParams } from '../types';

export function getCommerceContracts({
  transaction,
}: GetCommerceContractsParams): ContractFunctionParameters[] {
  const { callData, metaData } = transaction;

  return [
    {
      address: callData.recipientCurrency,
      abi: erc20Abi,
      functionName: CONTRACT_METHODS.APPROVE,
      args: [
        metaData.contractAddress,
        BigInt(callData.recipientAmount) + BigInt(callData.feeAmount),
      ],
    },
    {
      address: metaData.contractAddress,
      abi: COMMERCE_ABI,
      functionName: CONTRACT_METHODS.TRANSFER_TOKEN_PRE_APPROVED,
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
