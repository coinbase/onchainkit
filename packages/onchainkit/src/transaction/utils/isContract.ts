import type { ContractFunctionParameters } from 'viem';
import type { Call } from '../types';

export function isContract(
  transaction: Call | ContractFunctionParameters,
): transaction is ContractFunctionParameters {
  return 'abi' in transaction;
}
