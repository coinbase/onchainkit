import type { APIError, GetSwapQuoteResponse } from '@/api/types';
import type { LifecycleStatusUpdate } from '@/internal/types';
import type {
  LifecycleStatus,
  SwapConfig,
  SwapError,
  SwapUnit,
} from '@/swap/types';
import type { Token } from '@/token';
import type { Address, TransactionReceipt } from 'viem';

export type BuyReact = {
  /** Optional className override for top div element. */
  className?: string;
  config?: SwapConfig;
  /** Disables Buy button */
  disabled?: boolean;
  experimental?: {
    /** Whether to use a DEX aggregator. (default: false) */
    useAggregator: boolean;
  };
  /** An optional setting to sponsor swaps with a Paymaster. (default: false) */
  isSponsored?: boolean;
  /** An optional callback function that handles errors within the provider. */
  onError?: (error: SwapError) => void;
  /** An optional callback function that exposes the component lifecycle state */
  onStatus?: (lifecycleStatus: LifecycleStatus) => void;
  /** An optional callback function that exposes the transaction receipt */
  onSuccess?: (transactionReceipt?: TransactionReceipt) => void;
  /** An optional token to swap from */
  fromToken?: Token;
  /** The token to swap to */
  toToken: Token;
};

export type BuyContextType = {
  /** Used to check if user is connected in SwapButton */
  address?: Address;
  config: SwapConfig;
  disabled?: boolean;
  fromETH: SwapUnit;
  fromUSDC: SwapUnit;
  lifecycleStatus: LifecycleStatus;
  handleAmountChange: (amount: string) => void;
  handleSubmit: (fromToken: SwapUnit) => void;
  /** A function to set the lifecycle status of the component */
  updateLifecycleStatus: (
    state: LifecycleStatusUpdate<LifecycleStatus>,
  ) => void;
  setTransactionHash: (hash: string) => void;
  fromToken?: Token;
  to?: SwapUnit;
  from?: SwapUnit;
  toToken: Token;
  transactionHash: string;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  startPopupMonitor: (popupWindow: Window) => void;
};

export type BuyProviderReact = {
  children: React.ReactNode;
  config?: {
    /** Maximum acceptable slippage for a swap. (default: 10) This is as a percent, not basis points */
    maxSlippage: number;
  };
  disabled?: boolean;
  experimental: {
    /** Whether to use a DEX aggregator. (default: false) */
    useAggregator: boolean;
  };
  /** An optional setting to sponsor swaps with a Paymaster. (default: false) */
  isSponsored?: boolean;
  /** An optional callback function that handles errors within the provider. */
  onError?: (error: SwapError) => void;
  /** An optional callback function that exposes the component lifecycle state */
  onStatus?: (lifecycleStatus: LifecycleStatus) => void;
  /** An optional callback function that exposes the transaction receipt */
  onSuccess?: (transactionReceipt?: TransactionReceipt) => void;
  fromToken?: Token;
  toToken: Token;
};

export type BuyTokens = {
  fromETH: SwapUnit;
  fromUSDC: SwapUnit;
  to: SwapUnit;
  from?: SwapUnit;
};

export type GetBuyQuoteResponse = {
  response?: GetSwapQuoteResponse;
  error?: APIError;
  formattedFromAmount?: string;
};
