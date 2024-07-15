// 🌲☀🌲
import type { ReactNode } from 'react';
import type { Abi, Account, Address, ContractFunctionName, Hex } from 'viem';
import type { Config } from 'wagmi';
import type {
  UseSendCallsParameters,
  UseSendCallsReturnType,
} from 'wagmi/experimental';

export type Contract = {
  address: Address;
  abi: Abi;
  functionName: ContractFunctionName;
  args?: { to: Hex; data?: Hex; value?: bigint }[];
};

export type TransactionButtonReact = UseSendCallsReturnType<
  Config,
  unknown
>['sendCalls']['arguments'] & {
  mutation?: UseSendCallsParameters<Config, unknown>['mutation'];
} & { className?: string; text?: string };

/**
 * Note: exported as public Type
 */
export type TransactionContextType = {
  address: Address;
  contracts: Contract[];
  error?: TransactionErrorState;
  errorMessage?: string;
  isLoading: boolean;
  gasFee?: string;
  setErrorMessage: (error: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  transactionId?: string;
  setTransactionId: (id: string) => void;
};

/**
 * Note: exported as public Type
 */
export type TransactionError = {
  code: string; // The error code
  error: string; // The error message
};

export type TransactionErrorState = {
  TransactionError?: TransactionError;
};

export type TransactionGasFeeEstimateReact = {
  className?: string;
};

export type TransactionGasFeeLabelReact = {
  className?: string;
};

export type TransactionGasFeeReact = {
  children: ReactNode;
  className?: string;
};

export type TransactionGasFeeSponsoredByReact = {
  className?: string;
};

export type TransactionMessageReact = {
  className?: string;
};

export type TransactionProviderReact = {
  address: Address;
  children: ReactNode;
  contracts: Contract[];
};

/**
 * Note: exported as public Type
 */
export type TransactionReact = {
  address: Address;
  children: ReactNode;
  className?: string;
  contracts: Contract[];
};

export type TransactionStatusActionReact = {
  className?: string;
};

export type TransactionStatusLabelReact = {
  className?: string;
};

export type TransactionStatusReact = {
  children: ReactNode;
  className?: string;
};
