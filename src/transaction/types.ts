// 🌲☀🌲
import type { ReactNode } from 'react';
import type {
  Address,
  ContractFunctionParameters,
  TransactionReceipt,
} from 'viem';

/**
 * Note: exported as public Type
 */
export type TransactionButtonReact = {
  className?: string; // An optional CSS class name for styling the button component.
  disabled?: boolean; // A optional prop to disable the submit button
  text?: string; // An optional text to be displayed in the button component.
};

/**
 * Note: exported as public Type
 */
export type TransactionContextType = {
  address: Address; // The wallet address involved in the transaction.
  chainId?: number; // The chainId for the transaction.
  contracts: ContractFunctionParameters[]; // An array of contracts for the transaction.
  errorMessage?: string; // An error message string if the transaction encounters an issue.
  hasPaymaster?: boolean; // A boolean indicating if app has paymaster configured
  isLoading: boolean; // A boolean indicating if the transaction is currently loading.
  isToastVisible: boolean; // A boolean indicating if the transaction toast notification is visible.
  onSubmit: () => void; // A function called when the transaction is submitted.
  receipt?: TransactionReceipt; // The receipt of the transaction
  setErrorMessage: (error: string) => void; // A function to set the error message for the transaction.
  setIsToastVisible: (isVisible: boolean) => void; // A function to set the visibility of the transaction toast.
  setTransactionId: (id: string) => void; // A function to set the transaction ID.
  statusWriteContract?: string; // An optional string indicating the current status of the transaction.
  statusWriteContracts?: string; // An optional string indicating the current status of the transaction.
  transactionId?: string; // An optional string representing the ID of the transaction.
  transactionHash?: string; // An optional string representing the hash of the transaction.
};

/**
 * Paymaster service configuration
 */
type PaymasterService = {
  url: string;
};

/**
 * Note: exported as public Type
 */
export type TransactionError = {
  code: string; // The error code representing the type of transaction error.
  error: string; // The error message providing details about the transaction error.
};

/**
 * Note: exported as public Type
 */
export type TransactionProviderReact = {
  address: Address; // The wallet address to be provided to child components.
  capabilities?: WalletCapabilities; // Capabilities that a wallet supports (e.g. paymasters, session keys, etc).
  chainId?: number; // The chainId for the transaction.
  children: ReactNode; // The child components to be rendered within the provider component.
  contracts: ContractFunctionParameters[]; // An array of contract function parameters provided to the child components.
  onError?: (e: TransactionError) => void; // An optional callback function that handles errors within the provider.
  onSuccess?: (response: TransactionResponse) => void; // An optional callback function that exposes transaction hash
};

/**
 * Note: exported as public Type
 */
export type TransactionReact = {
  address: Address; // The wallet address involved in the transaction.
  capabilities?: WalletCapabilities; // Capabilities that a wallet supports (e.g. paymasters, session keys, etc).
  chainId?: number; // The chainId for the transaction.
  children: ReactNode; // The child components to be rendered within the transaction component.
  className?: string; // An optional CSS class name for styling the component.
  contracts: ContractFunctionParameters[]; // An array of contract function parameters for the transaction.
  onError?: (e: TransactionError) => void; // An optional callback function that handles transaction errors.
  onSuccess?: (response: TransactionResponse) => void; // An optional callback function that exposes transaction hash
};

/**
 * Note: exported as public Type
 */
export type TransactionResponse = {
  transactionHash: string; // Proof that a transaction was validated and added to the blockchain
  receipt: TransactionReceipt; // The receipt of the transaction
};

/**
 * Note: exported as public Type
 */
export type TransactionSponsorReact = {
  className?: string; // An optional CSS class name for styling the sponsor component.
};

/**
 * Note: exported as public Type
 */
export type TransactionStatusReact = {
  children: ReactNode; // The child components to be rendered within the status component.
  className?: string; // An optional CSS class name for styling the status component.
};

/**
 * Note: exported as public Type
 */
export type TransactionStatusActionReact = {
  className?: string; // An optional CSS class name for styling.
};

/**
 * Note: exported as public Type
 */
export type TransactionStatusLabelReact = {
  className?: string; // An optional CSS class name for styling.
};

/**
 * Note: exported as public Type
 */
export type TransactionToastReact = {
  children: ReactNode; // The child components to be rendered within the toast component.
  className?: string; // An optional CSS class name for styling the toast component.
  durationMs?: number; // An optional value to customize time until toast disappears
  position?: 'top-center' | 'top-right' | 'bottom-center' | 'bottom-right'; // An optional position property to specify the toast's position on the screen.
};

/**
 * Note: exported as public Type
 */
export type TransactionToastActionReact = {
  className?: string; // An optional CSS class name for styling.
};

/**
 * Note: exported as public Type
 */
export type TransactionToastIconReact = {
  className?: string; // An optional CSS class name for styling.
};

/**
 * Note: exported as public Type
 */
export type TransactionToastLabelReact = {
  className?: string; // An optional CSS class name for styling.
};

/**
 * Note: exported as public Type
 *
 * Wallet capabilities configuration
 */
export type WalletCapabilities = {
  paymasterService?: PaymasterService;
};
