// 🌲☀🌲
import type { ReactNode } from 'react';
import type { Abi, Account, Address, ContractFunctionName, Hex } from 'viem';

type Contract = {
  address: Address;
  abi: Abi;
  functionName: ContractFunctionName;
  args?: { to: Hex; data?: Hex; value?: bigint }[];
};

export type TransactionButtonReact = {
  className?: string;
  text?: string;
};

/**
 * Note: exported as public Type
 */
export type TransactionContextType = {
  address: Address;
  contracts?: Contract[];
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

export type TransactionMessageReact = {
  className?: string;
};

export type TransactionProviderReact = {
  address: Address;
  children: ReactNode;
  contracts?: Contract[];
};

/**
 * Note: exported as public Type
 */
export type TransactionReact = {
  address: Address;
  children: ReactNode;
  className?: string;
  contracts?: Contract[];
};
