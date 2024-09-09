import { type ContractFunctionParameters, erc20Abi } from 'viem';
import type { PayTransaction } from '../../api/types';

const commerceAbi = [
  {
    type: 'function',
    name: 'transferTokenPreApproved',
    inputs: [
      {
        name: '_intent',
        type: 'tuple',
        components: [
          {
            name: 'recipientAmount',
            type: 'uint256',
          },
          {
            name: 'deadline',
            type: 'uint256',
          },
          {
            name: 'recipient',
            type: 'address',
          },
          {
            name: 'recipientCurrency',
            type: 'address',
          },
          {
            name: 'refundDestination',
            type: 'address',
          },
          {
            name: 'feeAmount',
            type: 'uint256',
          },
          {
            name: 'id',
            type: 'bytes16',
          },
          {
            name: 'operator',
            type: 'address',
          },
          {
            name: 'signature',
            type: 'bytes',
          },
          {
            name: 'prefix',
            type: 'bytes',
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;

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
      abi: commerceAbi,
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
