import { useMemo } from 'react';
import type { ContractFunctionParameters } from 'viem';
import {
  TRANSACTION_TYPE_CALLS,
  TRANSACTION_TYPE_CONTRACTS,
} from '../constants';
import type { CallsType } from '../types';

export const useTransactionType = ({
  calls,
  contracts,
}: {
  calls?: CallsType[];
  contracts?: ContractFunctionParameters[];
}) => {
  return useMemo(() => {
    if (calls && contracts) {
      throw new Error(
        "Only one of 'calls' or 'contracts' should be defined, not both.",
      );
    }
    if (calls) {
      return TRANSACTION_TYPE_CALLS;
    }
    if (contracts) {
      return TRANSACTION_TYPE_CONTRACTS;
    }
    throw new Error("Either 'calls' or 'contracts' must be defined.");
  }, [calls, contracts]);
};
