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
// 🌲☀🌲
import type { TransactionError } from '../api/types';

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
    }
  | {
      statusName: 'reset';
      statusData: null;
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
  /** An optional CSS class name for styling the button component */
  className?: string;
  /** A optional prop to disable the submit button */
  disabled?: boolean;
  /** An optional text to be displayed in the button component */
  text?: ReactNode;
  /** Optional overrides for text and onClick handler in error state (default is resubmit txn) */
  errorOverride?: TransactionButtonOverride;
  /** Optional overrides for text and onClick handler in success state (default is view txn on block explorer) */
  successOverride?: TransactionButtonOverride;
  /** Optional overrides for text in pending state (default is loading spinner) */
  pendingOverride?: Pick<TransactionButtonOverride, 'text'>;
};

export type TransactionContextType = {
  /** The chainId for the transaction */
  chainId?: number;
  /** An error code used to localize errors and provide more context with unit-tests */
  errorCode?: string;
  /** An error message string if the transaction encounters an issue */
  errorMessage?: string;
  /** A boolean indicating if the transaction is currently loading */
  isLoading: boolean;
  /** A boolean indicating if the transaction toast notification is visible */
  isToastVisible: boolean;
  /** A function called when the transaction is submitted */
  onSubmit: () => void;
  /** The paymaster URL for the transaction */
  paymasterUrl: string | null;
  /** The receipt of the transaction */
  receipt?: TransactionReceipt;
  /** The lifecycle status of the transaction */
  lifecycleStatus: LifecycleStatus;
  /** A function to set the visibility of the transaction toast */
  setIsToastVisible: (isVisible: boolean) => void;
  /** A function to set the lifecycle status of the component */
  setLifecycleStatus: (state: LifecycleStatus) => void;
  /** A function to set the transaction ID */
  setTransactionId: (id: string) => void;
  /** An array of transactions for the component or a promise that resolves to an array of transactions */
  transactions?: Calls | Contracts | Array<Call | ContractFunctionParameters>;
  /** An optional string representing the ID of the transaction */
  transactionId?: string;
  /** An optional string representing the hash of the transaction */
  transactionHash?: string;
  /** Number of transactions being executed */
  transactionCount?: number;
};

type PaymasterService = {
  url: string;
};

export type SendBatchedTransactionsParams = {
  capabilities?: WalletCapabilities;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  sendCallsAsync: any;
  transactions?: Array<Call | ContractFunctionParameters>;
};

export type SendSingleTransactionParams = {
  config: Config;
  sendCallAsync: SendTransactionMutateAsync<Config, unknown> | (() => void);
  transactions: Array<Call | ContractFunctionParameters>;
};

/**
 * Note: exported as public Type
 */

export type TransactionDefaultReact = {
  disabled?: boolean;
} & Omit<TransactionReact, 'children'>;

export type Calls = Call[] | Promise<Call[]> | (() => Promise<Call[]>);
export type Contracts =
  | ContractFunctionParameters[]
  | Promise<ContractFunctionParameters[]>
  | (() => Promise<ContractFunctionParameters[]>);

export type TransactionProviderReact = {
  /** An array of calls to be made in the transaction */
  calls?: Calls | Contracts | Array<Call | ContractFunctionParameters>;
  /**
   * @deprecated Use `isSponsored` instead.
   */
  capabilities?: WalletCapabilities;
  /** The chainId for the transaction */
  chainId: number;
  /** The child components to be rendered within the provider component */
  children: ReactNode;
  /**
   * @deprecated Use `calls` instead.
   */
  contracts?: Calls | Contracts | Array<Call | ContractFunctionParameters>;
  /** Whether the transactions are sponsored (default: false) */
  isSponsored?: boolean;
  /** An optional callback function that handles errors within the provider */
  onError?: (e: TransactionError) => void;
  /** An optional callback function that exposes the component lifecycle state */
  onStatus?: (lifecycleStatus: LifecycleStatus) => void;
  /** An optional callback function that exposes the transaction receipts */
  onSuccess?: (response: TransactionResponse) => void;
  /** An optional time (in ms) after which to reset the component */
  resetAfter?: number;
};

/**
 * Note: exported as public Type
 */
export type TransactionReact = {
  /** An array of calls to be made in the transaction */
  calls?: Calls | Contracts | Array<Call | ContractFunctionParameters>;
  /**
   * @deprecated Use `isSponsored` instead.
   */
  capabilities?: WalletCapabilities;
  /** The chainId for the transaction */
  chainId?: number;
  /** The child components to be rendered within the transaction component */
  children?: ReactNode;
  /** An optional CSS class name for styling the component */
  className?: string;
  /**
   * @deprecated Use `calls` instead.
   */
  contracts?: Calls | Contracts | Array<Call | ContractFunctionParameters>;
  /** Whether the transactions are sponsored (default: false) */
  isSponsored?: boolean;
  /** An optional callback function that handles transaction errors */
  onError?: (e: TransactionError) => void;
  /** An optional callback function that exposes the component lifecycle state */
  onStatus?: (lifecycleStatus: LifecycleStatus) => void;
  /** An optional callback function that exposes the transaction receipts */
  onSuccess?: (response: TransactionResponse) => void;
  /** An optional time (in ms) after which to reset the component */
  resetAfter?: number;
} & (
  | {
      children: ReactNode;
      /** An optional prop to disable submit button. Only available when children are not provided. */
      disabled?: never;
    }
  | {
      children?: never;
      /** An optional prop to disable submit button. Only available when children are not provided. */
      disabled?: boolean;
    }
);

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
  /** An optional CSS class name for styling the sponsor component */
  className?: string;
};

/**
 * Note: exported as public Type
 */
export type TransactionStatusReact = {
  /** The child components to be rendered within the status component */
  children?: ReactNode;
  /** An optional CSS class name for styling the status component */
  className?: string;
};

/**
 * Note: exported as public Type
 */
export type TransactionStatusActionReact = {
  /** An optional CSS class name for styling */
  className?: string;
};

/**
 * Note: exported as public Type
 */
export type TransactionStatusLabelReact = {
  /** An optional CSS class name for styling */
  className?: string;
};

/**
 * Note: exported as public Type
 */
export type TransactionToastReact = {
  /** The child components to be rendered within the toast component */
  children?: ReactNode;
  /** An optional CSS class name for styling the toast component */
  className?: string;
  /** An optional value to customize time until toast disappears */
  durationMs?: number;
  /** An optional position property to specify the toast's position on the screen */
  position?: 'top-center' | 'top-right' | 'bottom-center' | 'bottom-right';
};

/**
 * Note: exported as public Type
 */
export type TransactionToastActionReact = {
  /** An optional CSS class name for styling */
  className?: string;
};

/**
 * Note: exported as public Type
 */
export type TransactionToastIconReact = {
  /** An optional CSS class name for styling */
  className?: string;
};

/**
 * Note: exported as public Type
 */
export type TransactionToastLabelReact = {
  /** An optional CSS class name for styling */
  className?: string;
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
  /* eslint-disable @typescript-eslint/no-explicit-any */
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
