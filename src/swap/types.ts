import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { Address, Hex, TransactionReceipt } from 'viem';
import type {
  Config,
  UseBalanceReturnType,
  UseReadContractReturnType,
} from 'wagmi';
import type { SendTransactionMutateAsync } from 'wagmi/query';
import type { RawTransactionData } from '../api/types';
import type { Token } from '../token/types';

/**
 * Note: exported as public Type
 */
export type BuildSwapTransaction = {
  approveTransaction?: Transaction; // The approval transaction (https://metaschool.so/articles/what-are-erc20-approve-erc20-allowance-methods/)
  fee: Fee; // The fee for the swap
  quote: SwapQuote; // The quote for the swap
  transaction: Transaction; // The object developers should pass into Wagmi's signTransaction
  warning?: QuoteWarning; // The warning associated with the swap
};

/**
 * Note: exported as public Type
 */
export type BuildSwapTransactionResponse = BuildSwapTransaction | SwapError;

/**
 * Note: exported as public Type
 */
export type Fee = {
  amount: string; // The amount of the fee
  baseAsset: Token; // The base asset for the fee
  percentage: string; // The percentage of the fee
};

export type FromTo = {
  from: SwapUnit;
  to: SwapUnit;
};

export type GetSwapMessageParams = {
  address?: Address;
  error?: SwapError;
  loading?: boolean;
  isTransactionPending?: boolean;
  isMissingRequiredFields?: boolean;
  to: SwapUnit;
  from: SwapUnit;
};

/**
 * Note: exported as public Type
 */
export type QuoteWarning = {
  description?: string; // The description of the warning
  message?: string; // The message of the warning
  type?: string; // The type of the warning
};

/**
 * List of swap lifecycle statuses.
 * The order of the statuses loosely follows the swap lifecycle.
 *
 * Note: exported as public Type
 */
export type LifeCycleStatus =
  | {
      statusName: 'init';
      statusData: {
        isMissingRequiredField: boolean;
        maxSlippage: number;
      };
    }
  | {
      statusName: 'error';
      statusData: SwapError;
    }
  | {
      statusName: 'amountChange';
      statusData: {
        amountFrom: string;
        amountTo: string;
        maxSlippage: number;
        tokenFrom?: Token;
        tokenTo?: Token;
        isMissingRequiredField: boolean;
      };
    }
  | {
      statusName: 'slippageChange';
      statusData: {
        maxSlippage: number;
      };
    }
  | {
      statusName: 'transactionPending';
      statusData: {
        maxSlippage: number;
      };
    }
  | {
      statusName: 'transactionApproved';
      statusData: {
        maxSlippage: number;
        transactionHash: Hex;
        transactionType: 'ERC20' | 'Permit2';
      };
    }
  | {
      statusName: 'success';
      statusData: {
        maxSlippage: number;
        transactionReceipt: TransactionReceipt;
      };
    };

export type ProcessSwapTransactionParams = {
  config: Config;
  setLifeCycleStatus: (state: LifeCycleStatus) => void;
  sendTransactionAsync: SendTransactionMutateAsync<Config, unknown>;
  swapTransaction: BuildSwapTransaction;
  useAggregator: boolean;
};

/**
 * Note: exported as public Type
 */
export type SwapAmountInputReact = {
  className?: string; // Optional className override for top div element.
  delayMs?: number; // The debounce delay in milliseconds
  label: string; // Descriptive label for the input field
  swappableTokens?: Token[]; // Swappable tokens
  token?: Token; // Selected token
  type: 'to' | 'from'; // Identifies if component is for toToken or fromToken
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
  className?: string; // Optional className override for top div element.
  disabled?: boolean; // Disables swap button
};

export type SwapContextType = {
  address?: Address; // Used to check if user is connected in SwapButton
  error?: SwapError;
  from: SwapUnit;
  lifeCycleStatus: LifeCycleStatus;
  loading: boolean;
  isTransactionPending: boolean;
  handleAmountChange: (
    t: 'from' | 'to',
    amount: string,
    st?: Token,
    dt?: Token,
  ) => void;
  handleSubmit: () => void;
  handleToggle: () => void;
  setLifeCycleStatus: (state: LifeCycleStatus) => void; // A function to set the lifecycle status of the component
  to: SwapUnit;
};

/**
 * Note: exported as public Type
 */
export type SwapError = {
  code: string; // The error code representing the type of swap error.
  error: string; // The error message providing details about the swap error.
  message: string; // The error message providing details about the swap error.
};

export type SwapLoadingState = {
  isSwapLoading: boolean;
};

/**
 * Note: exported as public Type
 */
export type SwapMessageReact = {
  className?: string; // Optional className override for top div element.
};

/**
 * Note: exported as public Type
 */
export type SwapQuote = {
  amountReference: string; // The reference amount for the quote
  from: Token; // The source token for the swap
  fromAmount: string; // The amount of the source token
  hasHighPriceImpact: boolean; // Whether the price impact is high
  priceImpact: string; // The price impact of the swap
  slippage: string; // The slippage of the swap
  to: Token; // The destination token for the swap
  toAmount: string; // The amount of the destination token
  warning?: QuoteWarning; // The warning associated with the quote
};

export type SwapParams = {
  amount: string;
  fromAddress: Address;
  from: Token;
  to: Token;
};

export type SwapProviderReact = {
  children: React.ReactNode;
  experimental: {
    useAggregator: boolean; // Whether to use a DEX aggregator. (default: true)
    maxSlippage?: number; // Maximum acceptable slippage for a swap. (default: 10) This is as a percent, not basis points
  };
  onError?: (error: SwapError) => void; // An optional callback function that handles errors within the provider.
  onStatus?: (lifeCycleStatus: LifeCycleStatus) => void; // An optional callback function that exposes the component lifecycle state
  onSuccess?: (transactionReceipt: TransactionReceipt) => void; // An optional callback function that exposes the transaction receipt
};

/**
 * Note: exported as public Type
 */
export type SwapReact = {
  children: ReactNode;
  className?: string; // Optional className override for top div element.
  experimental?: {
    useAggregator: boolean; // Whether to use a DEX aggregator. (default: true)
    maxSlippage?: number; // Maximum acceptable slippage for a swap. (default: 10) This is as a percent, not basis points
  };
  onError?: (error: SwapError) => void; // An optional callback function that handles errors within the provider.
  onStatus?: (lifeCycleStatus: LifeCycleStatus) => void; // An optional callback function that exposes the component lifecycle state
  onSuccess?: (transactionReceipt: TransactionReceipt) => void; // An optional callback function that exposes the transaction receipt
  title?: string; // Title for the Swap component. (default: "Swap")
};

/**
 * Note: exported as public Type
 */
export type SwapSettingsReact = {
  children: ReactNode;
  className?: string; // Optional className override for top div element.
  icon?: ReactNode; // Optional icon override
  text?: string; // Optional text override
};

/**
 * Note: exported as public Type
 */
export type SwapSettingsSlippageTitleReact = {
  children: ReactNode;
  className?: string; // Optional className override for top div element.
};

/**
 * Note: exported as public Type
 */
export type SwapSettingsSlippageDescriptionReact = {
  children: ReactNode;
  className?: string; // Optional className override for top div element.
};

/**
 * Note: exported as public Type
 */
export type SwapSettingsSlippageInputReact = {
  className?: string; // Optional className override for top div element.
  defaultSlippage?: number; // Optional default slippage value in pecentage.
};

export type SwapSettingsSlippageLayoutReact = {
  children: ReactNode;
  className?: string; // Optional className override for top div element.
};

/**
 * Note: exported as public Type
 */
export type SwapToggleButtonReact = {
  className?: string; // Optional className override for top div element.
};

export type SwapUnit = {
  amount: string;
  balance?: string;
  balanceResponse?: UseBalanceReturnType | UseReadContractReturnType;
  error?: SwapError;
  loading: boolean;
  setAmount: Dispatch<SetStateAction<string>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setToken: Dispatch<SetStateAction<Token | undefined>>;
  token: Token | undefined;
};

/**
 * Note: exported as public Type
 */
export type Transaction = {
  chainId: number; // The chain ID
  data: Hex; // The data for the transaction
  gas: bigint; // The gas limit
  maxFeePerGas?: bigint | undefined; // The maximum fee per gas
  maxPriorityFeePerGas?: bigint | undefined; // The maximum priority fee per gas
  nonce?: number; // The nonce for the transaction
  to: Address; // The recipient address
  value: bigint; // The value of the transaction
};
