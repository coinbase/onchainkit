// 🌲☀🌲
import type { ReactNode } from 'react';
import type { Abi, Address, ContractFunctionName, Hex } from 'viem';
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
  onSubmit: () => void;
  setErrorMessage: (error: string) => void;
  setTransactionId: (id: string) => void;
  transactionId?: string;
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

/**
 * Note: exported as public Type
 */
export type TransactionReact = {
  address: Address;
  children: ReactNode;
  className?: string;
  contracts: Contract[];
};

export type TransactionGasFeeReact = {
  children: ReactNode;
  className?: string;
};

export type TransactionGasFeeEstimateReact = {
  className?: string;
};

export type TransactionGasFeeLabelReact = {
  className?: string;
};

export type TransactionGasFeeSponsorReact = {
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

export type TransactionStatusReact = {
  children: ReactNode;
  className?: string;
};

export type TransactionStatusActionReact = {
  className?: string;
};

export type TransactionStatusLabelReact = {
  className?: string;
};
