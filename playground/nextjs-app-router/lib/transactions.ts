import { encodeFunctionData } from 'viem';
import { clickAbi } from './abi/Click';
import { deployedContracts } from './constants';

export const clickContracts = [
  {
    address: deployedContracts[85432].click,
    abi: clickAbi,
    functionName: 'click',
    args: [],
  },
  {
    address: deployedContracts[85432].click,
    abi: clickAbi,
    functionName: 'click',
    args: [],
  },
];

export const combo = [
  {
    address: deployedContracts[85432].click,
    abi: clickAbi,
    functionName: 'click',
    args: [],
  },
  {
    data: encodeFunctionData({
      abi: clickAbi,
      functionName: 'click',
      args: [],
    }),
    to: deployedContracts[85432].click,
  },
]

export const clickCalls = [
  {
    data: encodeFunctionData({
      abi: clickAbi,
      functionName: 'click',
      args: [],
    }),
    to: deployedContracts[85432].click,
  },
  {
    data: encodeFunctionData({
      abi: clickAbi,
      functionName: 'click',
      args: [],
    }),
    to: deployedContracts[85432].click,
  },
];
