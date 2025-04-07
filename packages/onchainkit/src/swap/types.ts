import type { LifecycleStatusUpdate } from '@/internal/types';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type {
  Address,
  Hex,
  TransactionReceipt,
  WalletCapabilities,
} from 'viem';
import type {
  Config,
  UseBalanceReturnType,
  UseReadContractReturnType,
} from 'wagmi';
import type {
  SendTransactionMutateAsync,
  SwitchChainMutateAsync,
} from 'wagmi/query';
import type { BuildSwapTransaction, RawTransactionData } from '../api/types';
import type { Token } from '../token/types';
import type { Call } from '../transaction/types';

export type SendSwapTransactionParams = {
  config: Config;
  isSponsored?: boolean; // Whether the swap is sponsored (default: false)
  paymaster?: string; // OnchainKit config paymaster RPC url
  /* eslint-disable @typescript-eslint/no-explicit-any */
  sendCallsAsync: any;
  sendTransactionAsync: SendTransactionMutateAsync<Config, unknown>;
  transactions: SwapTransaction[]; // A list of transactions to execute
  updateLifecycleStatus: (
    state: LifecycleStatusUpdate<LifecycleStatus>,
  ) => void;
  walletCapabilities: WalletCapabilities; // EIP-5792 wallet capabilities
};

export type SendSingleTransactionsParams = {
  config: Config;
  sendTransactionAsync: SendTransactionMutateAsync<Config, unknown>;
  transactions: SwapTransaction[]; // A list of transactions to execute
  updateLifecycleStatus: (
    state: LifecycleStatusUpdate<LifecycleStatus>,
  ) => void;
};

/**
 * Note: exported as public Type
 */
export type Fee = {
  /** The amount of the fee */
  amount: string;
  /** The base asset for the fee */
  baseAsset: Token;
  /** The percentage of the fee */
  percentage: string;
};

export type FromTo = {
  from: SwapUnit;
  to: SwapUnit;
};

export type GetSwapMessageParams = {
  address?: Address;
  lifecycleStatus: LifecycleStatus;
  to: SwapUnit;
  from: SwapUnit;
};

/**
 * Note: exported as public Type
 */
export type QuoteWarning = {
  /** The description of the warning */
  description?: string;
  /** The message of the warning */
  message?: string;
  /** The type of the warning */
  type?: string;
};

type LifecycleStatusDataShared = {
  isMissingRequiredField: boolean;
  maxSlippage: number;
};

/**
 * List of swap lifecycle statuses.
 * The order of the statuses loosely follows the swap lifecycle.
 *
 * Note: exported as public Type
 */
export type LifecycleStatus =
  | {
      statusName: 'init';
      statusData: LifecycleStatusDataShared;
    }
  | {
      statusName: 'error';
      statusData: SwapError & LifecycleStatusDataShared;
    }
  | {
      statusName: 'amountChange';
      statusData: {
        amountFrom?: string;
        amountETH?: string;
        amountUSDC?: string;
        amountTo: string;
        tokenFrom?: Token;
        tokenFromETH?: Token;
        tokenFromUSDC?: Token;
        tokenTo?: Token;
      } & LifecycleStatusDataShared;
    }
  | {
      statusName: 'slippageChange';
      statusData: LifecycleStatusDataShared;
    }
  | {
      statusName: 'transactionPending';
      statusData: LifecycleStatusDataShared;
    }
  | {
      statusName: 'transactionApproved';
      statusData: {
        callsId?: Hex;
        transactionHash?: Hex;
        transactionType: SwapTransactionType;
      } & LifecycleStatusDataShared;
    }
  | {
      statusName: 'success';
      statusData: {
        transactionReceipt: TransactionReceipt;
      } & LifecycleStatusDataShared;
    };

export type ProcessSwapTransactionParams = {
  chainId?: number; // The chain ID
  config: Config;
  isSponsored?: boolean; // Whether the swap is sponsored (default: false)
  paymaster?: string; // OnchainKit config paymaster RPC url
  sendCallsAsync: any;
  sendTransactionAsync: SendTransactionMutateAsync<Config, unknown>;
  swapTransaction: BuildSwapTransaction; // The response from the Swap API
  switchChainAsync: SwitchChainMutateAsync<Config, unknown>; // To switch the chain to Base if not already provided
  updateLifecycleStatus: (
    state: LifecycleStatusUpdate<LifecycleStatus>,
  ) => void; // A function to set the lifecycle status of the component
  useAggregator: boolean;
  walletCapabilities: WalletCapabilities; // EIP-5792 wallet capabilities
};

/**
 * Note: exported as public Type
 */
export type SwapAmountInputReact = {
  /** Optional className override for top div element */
  className?: string;
  /** The debounce delay in milliseconds */
  delayMs?: number;
  /** Descriptive label for the input field */
  label: string;
  /** Swappable tokens */
  swappableTokens?: Token[];
  /** Selected token */
  token?: Token;
  /** Identifies if component is for toToken or fromToken */
  type: 'to' | 'from';
};

export type SwapAPIResponse = {
  approveTx?: RawTransactionData; // The approval transaction
  chainId: string; // The chain ID
  fee: Fee; // The fee for the trade
  quote: SwapQuote; // The quote for the trade
  tx: RawTransactionData; // The trade transaction
};

/**
 * Note: exported as public Type
 */
export type SwapButtonReact = {
  /** Optional className override for top div element */
  className?: string;
  /** Disables swap button */
  disabled?: boolean;
  /** Label for the swap button */
  label?: ReactNode;
};

export type SwapConfig = {
  maxSlippage: number; // Maximum acceptable slippage for a swap. (default: 10) This is as a percent, not basis points;
};

export type SwapContextType = {
  address?: Address; // Used to check if user is connected in SwapButton
  config: SwapConfig;
  from: SwapUnit;
  lifecycleStatus: LifecycleStatus;
  handleAmountChange: (
    t: 'from' | 'to',
    amount: string,
    st?: Token,
    dt?: Token,
  ) => void;
  handleSubmit: () => void;
  handleToggle: () => void;
  updateLifecycleStatus: (
    state: LifecycleStatusUpdate<LifecycleStatus>,
  ) => void; // A function to set the lifecycle status of the component
  to: SwapUnit;
  isToastVisible: boolean;
  setIsToastVisible: (visible: boolean) => void;
  transactionHash: string;
  setTransactionHash: (hash: string) => void;
};

/**
 * Note: exported as public Type
 */
export type SwapError = {
  /** The error code representing the type of swap error */
  code: string;
  /** The error message providing details about the swap error */
  error: string;
  /** The error message providing details about the swap error */
  message: string;
};

export type SwapLoadingState = {
  isSwapLoading: boolean;
};

/**
 * Note: exported as public Type
 */
export type SwapMessageReact = {
  /** Optional className override for top div element */
  className?: string;
};

/**
 * Note: exported as public Type
 */
export type SwapQuote = {
  /** The reference amount for the quote */
  amountReference: string;
  /** The source token for the swap */
  from: Token;
  /** The amount of the source token */
  fromAmount: string;
  /** The USD value of the source token */
  fromAmountUSD: string;
  /** Whether the price impact is high */
  hasHighPriceImpact: boolean;
  /** The price impact of the swap */
  priceImpact: string;
  /** The slippage of the swap */
  slippage: string;
  /** The destination token for the swap */
  to: Token;
  /** The amount of the destination token */
  toAmount: string;
  /** The USD value of the destination token */
  toAmountUSD: string;
  /** The warning associated with the quote */
  warning?: QuoteWarning;
};

export type SwapParams = {
  amount: string;
  fromAddress: Address;
  from: Token;
  to: Token;
};

export type SwapProviderReact = {
  children: React.ReactNode;
  config?: {
    maxSlippage: number; // Maximum acceptable slippage for a swap. (default: 10) This is as a percent, not basis points
  };
  experimental: {
    useAggregator: boolean; // Whether to use a DEX aggregator. (default: false)
  };
  isSponsored?: boolean; // An optional setting to sponsor swaps with a Paymaster. (default: false)
  onError?: (error: SwapError) => void; // An optional callback function that handles errors within the provider.
  onStatus?: (lifecycleStatus: LifecycleStatus) => void; // An optional callback function that exposes the component lifecycle state
  onSuccess?: (transactionReceipt: TransactionReceipt) => void; // An optional callback function that exposes the transaction receipt
};

/**
 * Note: exported as public Type
 */
export type SwapReact = {
  /** Optional className override for top div element */
  className?: string;
  /** Configuration options */
  config?: SwapConfig;
  /** Experimental features */
  experimental?: {
    /** Whether to use a DEX aggregator. (default: false) */
    useAggregator: boolean;
  };
  /** An optional setting to sponsor swaps with a Paymaster. (default: false) */
  isSponsored?: boolean;
  /** An optional callback function that handles errors within the provider */
  onError?: (error: SwapError) => void;
  /** An optional callback function that exposes the component lifecycle state */
  onStatus?: (lifecycleStatus: LifecycleStatus) => void;
  /** An optional callback function that exposes the transaction receipt */
  onSuccess?: (transactionReceipt: TransactionReceipt) => void;
  /** Title for the Swap component. (default: "Swap") */
  title?: ReactNode;
  /** Header left content for the Swap component (eg. back button) */
  headerLeftContent?: ReactNode;
} & (
  | {
      /** When React children are provided
       * swappableTokens, toToken, and fromToken should be passed to the SwapAmountInput component
       * disabled should be passed to the SwapButton component
       **/
      children: ReactNode;
      /** To token */
      to?: never;
      /** From token */
      from?: never;
      /** Disables swap button */
      disabled?: never;
    }
  | {
      /** When React Children are undefined, swappableTokens, toToken, and fromToken are required */
      children?: never;
      /** To token */
      to: Token[];
      /** From token */
      from: Token[];
      /** Disables swap button */
      disabled?: boolean;
    }
);

/**
 * Note: exported as public Type
 */
export type SwapDefaultReact = {
  /** Swappable tokens */
  to: Token[];
  /** Swappable tokens */
  from: Token[];
  /** Disables swap button */
  disabled?: boolean;
} & Omit<SwapReact, 'children'>;

/**
 * Note: exported as public Type
 */
export type SwapSettingsReact = {
  children?: ReactNode;
  /** Optional className override for top div element */
  className?: string;
  /** Optional icon override */
  icon?: ReactNode;
  /** Optional text override */
  text?: string;
};

/**
 * Note: exported as public Type
 */
export type SwapSettingsSlippageDescriptionReact = {
  children: ReactNode;
  /** Optional className override for top div element */
  className?: string;
};

/**
 * Note: exported as public Type
 */
export type SwapSettingsSlippageInputReact = {
  /** Optional className override for top div element */
  className?: string;
};

export type SwapSettingsSlippageLayoutReact = {
  children: ReactNode;
  /** Optional className override for top div element */
  className?: string;
};

/**
 * Note: exported as public Type
 */
export type SwapSettingsSlippageTitleReact = {
  children: ReactNode;
  /** Optional className override for top div element */
  className?: string;
};

/**
 * Note: exported as public Type
 */
export type SwapToggleButtonReact = {
  /** Optional className override for top div element */
  className?: string;
};

/**
 * Note: exported as public Type
 * Consists of atomic batch transactions, ERC-20 approvals, Permit2 approvals, and Swaps
 */
export type SwapTransactionType = 'Batched' | 'ERC20' | 'Permit2' | 'Swap';

export type SwapUnit = {
  amount: string;
  amountUSD: string;
  balance?: string;
  balanceResponse?: UseBalanceReturnType | UseReadContractReturnType;
  error?: SwapError;
  loading: boolean;
  setAmount: Dispatch<SetStateAction<string>>;
  setAmountUSD: Dispatch<SetStateAction<string>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setToken?: Dispatch<SetStateAction<Token | undefined>>;
  token: Token | undefined;
};

/**
 * Note: exported as public Type
 */
export type Transaction = {
  /** The chain ID */
  chainId: number;
  /** The data for the transaction */
  data: Hex;
  /** The gas limit */
  gas: bigint;
  /** The maximum fee per gas */
  maxFeePerGas?: bigint | undefined;
  /** The maximum priority fee per gas */
  maxPriorityFeePerGas?: bigint | undefined;
  /** The nonce for the transaction */
  nonce?: number;
  /** The recipient address */
  to: Address;
  /** The value of the transaction */
  value: bigint;
};

export type SwapToastReact = {
  /** An optional CSS class name for styling the toast component */
  className?: string;
  /** An optional value to customize time until toast disappears */
  durationMs?: number;
  /** An optional position property to specify the toast's position on the screen */
  position?: 'top-center' | 'top-right' | 'bottom-center' | 'bottom-right';
};

export type SwapTransaction = {
  transaction: Call;
  transactionType: SwapTransactionType;
};

export type UseAwaitCallsParams = {
  accountConfig: Config;
  lifecycleStatus: LifecycleStatus;
  /** A function to set the lifecycle status of the component */
  updateLifecycleStatus: (
    state: LifecycleStatusUpdate<LifecycleStatus>,
  ) => void;
};
