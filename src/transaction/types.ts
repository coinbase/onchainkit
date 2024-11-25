// 🌲☀🌲
import type { ReactNode } from 'react';
import type {
  Address,
  ContractFunctionParameters,
  Hex,
  TransactionReceipt,
} from 'viem';
import type { WalletCapabilities as ViemWalletCapabilities } from 'viem';
import type { Config } from 'wagmi';
import type { SendTransactionMutateAsync } from 'wagmi/query';

export type Call = { to: Hex; data?: Hex; value?: bigint };

type TransactionButtonOverride = {
  text?: ReactNode;
  onClick?: (receipt?: TransactionReceipt) => void;
};

/**
 * List of transaction lifecycle statuses.
 * The order of the statuses loosely follows the transaction lifecycle.
 *
 * Note: exported as public Type
 */
export type LifecycleStatus =
  | {
      statusName: 'init';
      statusData: null;
    }
  | {
      statusName: 'error';
      statusData: TransactionError;
    }
  | {
      statusName: 'transactionIdle'; // initial status prior to the mutation function executing
      statusData: null;
    }
  | {
      statusName: 'buildingTransaction';
      statusData: null;
    }
  | {
      statusName: 'transactionPending'; // if the mutation is currently executing
      statusData: null;
    }
  | {
      statusName: 'transactionLegacyExecuted';
      statusData: {
        transactionHashList: Address[];
      };
    }
  | {
      statusName: 'success'; // if the last mutation attempt was successful
      statusData: {
        transactionReceipts: TransactionReceipt[];
      };
    };

export type IsSpinnerDisplayedProps = {
  errorMessage?: string;
  hasReceipt?: boolean;
  isInProgress?: boolean;
  transactionHash?: string;
  transactionId?: string;
};

/**
 * Note: exported as public Type
 */
export type TransactionButtonReact = {
  className?: string; // An optional CSS class name for styling the button component.
  disabled?: boolean; // A optional prop to disable the submit button
  text?: ReactNode; // An optional text to be displayed in the button component.
  errorOverride?: TransactionButtonOverride; // Optional overrides for text and onClick handler in error state (default is resubmit txn)
  successOverride?: TransactionButtonOverride; // Optional overrides for text and onClick handler in success state (default is view txn on block explorer)
  pendingOverride?: Pick<TransactionButtonOverride, 'text'>; // Optional overrides for text in pending state (default is loading spinner)
};

export type TransactionContextType = {
  chainId?: number; // The chainId for the transaction.
  errorCode?: string; // An error code used to localize errors and provide more context with unit-tests.
  errorMessage?: string; // An error message string if the transaction encounters an issue.
  isLoading: boolean; // A boolean indicating if the transaction is currently loading.
  isToastVisible: boolean; // A boolean indicating if the transaction toast notification is visible.
  onSubmit: () => void; // A function called when the transaction is submitted.
  paymasterUrl: string | null; // The paymaster URL for the transaction.
  receipt?: TransactionReceipt; // The receipt of the transaction
  lifecycleStatus: LifecycleStatus; // The lifecycle status of the transaction.
  setIsToastVisible: (isVisible: boolean) => void; // A function to set the visibility of the transaction toast.
  setLifecycleStatus: (state: LifecycleStatus) => void; // A function to set the lifecycle status of the component
  setTransactionId: (id: string) => void; // A function to set the transaction ID.
  transactions?: Calls | Contracts | (Call | ContractFunctionParameters)[]; // An array of transactions for the component or a promise that resolves to an array of transactions.
  transactionId?: string; // An optional string representing the ID of the transaction.
  transactionHash?: string; // An optional string representing the hash of the transaction.
  transactionCount?: number; // Number of transactions being executed
};

type PaymasterService = {
  url: string;
};

export type SendBatchedTransactionsParams = {
  capabilities?: WalletCapabilities;
  // biome-ignore lint: cannot find module 'wagmi/experimental/query'
  sendCallsAsync: any;
  transactions?: (Call | ContractFunctionParameters)[];
};

export type SendSingleTransactionParams = {
  sendCallAsync: SendTransactionMutateAsync<Config, unknown> | (() => void);
  transactions: (Call | ContractFunctionParameters)[];
};

/**
 * Note: exported as public Type
 */

export type TransactionDefaultReact = {
  disabled?: boolean;
} & Omit<TransactionReact, 'children'>;

/**
 * Note: exported as public Type
 */
export type TransactionError = {
  code: string; // The error code representing the type of transaction error.
  error: string; // The error message providing details about the transaction error.
  message: string; // The error message providing details about the transaction error.
};

export type Calls = Call[] | Promise<Call[]> | (() => Promise<Call[]>);
export type Contracts =
  | ContractFunctionParameters[]
  | Promise<ContractFunctionParameters[]>
  | (() => Promise<ContractFunctionParameters[]>);

export type TransactionProviderReact = {
  calls?: Calls | Contracts | (Call | ContractFunctionParameters)[]; // An array of calls to be made in the transaction.
  /**
   * @deprecated Use `isSponsored` instead.
   */
  capabilities?: WalletCapabilities; // Capabilities that a wallet supports (e.g. paymasters, session keys, etc).
  chainId: number; // The chainId for the transaction.
  children: ReactNode; // The child components to be rendered within the provider component.
  /**
   * @deprecated Use `calls` instead.
   */
  contracts?: Calls | Contracts | (Call | ContractFunctionParameters)[]; // An array of calls to be made in the transaction.
  isSponsored?: boolean; // Whether the transactions are sponsored (default: false)
  onError?: (e: TransactionError) => void; // An optional callback function that handles errors within the provider.
  onStatus?: (lifecycleStatus: LifecycleStatus) => void; // An optional callback function that exposes the component lifecycle state
  onSuccess?: (response: TransactionResponse) => void; // An optional callback function that exposes the transaction receipts
};

/**
 * Note: exported as public Type
 */
export type TransactionReact = {
  calls?: Calls | Contracts | (Call | ContractFunctionParameters)[]; // An array of calls to be made in the transaction.
  /**
   * @deprecated Use `isSponsored` instead.
   */
  capabilities?: WalletCapabilities; // Capabilities that a wallet supports (e.g. paymasters, session keys, etc).
  chainId?: number; // The chainId for the transaction.
  children: ReactNode; // The child components to be rendered within the transaction component.
  className?: string; // An optional CSS class name for styling the component.
  /**
   * @deprecated Use `calls` instead.
   */
  contracts?: Calls | Contracts | (Call | ContractFunctionParameters)[]; // An array of calls to be made in the transaction.
  isSponsored?: boolean; // Whether the transactions are sponsored (default: false)
  onError?: (e: TransactionError) => void; // An optional callback function that handles transaction errors.
  onStatus?: (lifecycleStatus: LifecycleStatus) => void; // An optional callback function that exposes the component lifecycle state
  onSuccess?: (response: TransactionResponse) => void; // An optional callback function that exposes the transaction receipts
};

/**
 * Note: exported as public Type
 */
export type TransactionResponse = {
  transactionReceipts: TransactionReceipt[];
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

export type UseCallsStatusParams = {
  setLifecycleStatus: (state: LifecycleStatus) => void;
  transactionId: string;
};

export type UseWriteContractParams = {
  setLifecycleStatus: (state: LifecycleStatus) => void;
  transactionHashList: Address[];
};

export type UseWriteContractsParams = {
  setLifecycleStatus: (state: LifecycleStatus) => void;
  setTransactionId: (id: string) => void;
};

export type UseSendCallParams = {
  setLifecycleStatus: (state: LifecycleStatus) => void;
  transactionHashList: Address[];
};

export type UseSendCallsParams = {
  setLifecycleStatus: (state: LifecycleStatus) => void;
  setTransactionId: (id: string) => void;
};

export type UseSendWalletTransactionsParams = {
  capabilities?: WalletCapabilities;
  // biome-ignore lint: cannot find module 'wagmi/experimental/query'
  sendCallsAsync: any;
  sendCallAsync: SendTransactionMutateAsync<Config, unknown> | (() => void);
  walletCapabilities: ViemWalletCapabilities;
};

/**
 * Note: exported as public Type
 *
 * Wallet capabilities configuration
 */
export type WalletCapabilities = {
  paymasterService?: PaymasterService;
};
