import { encodeFunctionData } from 'viem';
import type { Call, GetResolvedTransactionsProps } from '../types';

export async function getResolvedTransactions({
  calls,
  contracts,
}: GetResolvedTransactionsProps) {
  const resolvedContracts = await (typeof contracts === 'function'
    ? contracts()
    : Promise.resolve(contracts));

  const resolvedCalls = await (typeof calls === 'function'
    ? calls()
    : Promise.resolve(calls));

  const reformattedContracts: Call[] | undefined =
    resolvedContracts?.map((contract) => {
      return {
        data: encodeFunctionData({
          abi: contract.abi,
          functionName: contract.functionName,
          args: contract.args,
        }),
        to: contract.address,
      };
    }) || [];

  // if resolvedCalls exist, combine with any formatted contract calls.
  // if calls exist and reformattedContracts exist, then user has passed
  // both contracts and calls so we will transform contracts to calls
  // and proceed with calls flow
  const combinedCalls: Call[] = resolvedCalls
    ? resolvedCalls?.concat(reformattedContracts)
    : [];

  // if combinedCalls exists, then user has passed calls so proceed
  // with calls flow
  // if combinedCalls is empty, then user has not passed any calls so proceed
  // with contract flow
  const resolvedTransactions = combinedCalls?.length
    ? combinedCalls
    : resolvedContracts;
  return resolvedTransactions;
}
