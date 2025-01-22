import type { APIError, GetSwapQuoteResponse } from '@/api/types';
import type { LifecycleStatusUpdate } from '@/core-react/internal/types';
import type {
  LifecycleStatus,
  SwapConfig,
  SwapError,
  SwapUnit,
} from '@/swap/types';
import type { Token } from '@/token';
import type { Address, TransactionReceipt } from 'viem';

export type BuyReact = {
  className?: string; // Optional className override for top div element.
  config?: SwapConfig;
  disabled?: boolean; // Disables Buy button
  experimental?: {
    useAggregator: boolean; // Whether to use a DEX aggregator. (default: true)
  };
  isSponsored?: boolean; // An optional setting to sponsor swaps with a Paymaster. (default: false)
  onError?: (error: SwapError) => void; // An optional callback function that handles errors within the provider.
  onStatus?: (lifecycleStatus: LifecycleStatus) => void; // An optional callback function that exposes the component lifecycle state
  onSuccess?: (transactionReceipt?: TransactionReceipt) => void; // An optional callback function that exposes the transaction receipt
  fromToken?: Token; // An optional token to swap from
  toToken: Token; // The token to swap to
};

export type BuyContextType = {
  address?: Address; // Used to check if user is connected in SwapButton
  config: SwapConfig;
  disabled?: boolean;
  fromETH: SwapUnit;
  fromUSDC: SwapUnit;
  lifecycleStatus: LifecycleStatus;
  handleAmountChange: (amount: string) => void;
  handleSubmit: (fromToken: SwapUnit) => void;
  updateLifecycleStatus: (
    state: LifecycleStatusUpdate<LifecycleStatus>,
  ) => void; // A function to set the lifecycle status of the component
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
    maxSlippage: number; // Maximum acceptable slippage for a swap. (default: 10) This is as a percent, not basis points
  };
  disabled?: boolean;
  experimental: {
    useAggregator: boolean; // Whether to use a DEX aggregator. (default: true)
  };
  isSponsored?: boolean; // An optional setting to sponsor swaps with a Paymaster. (default: false)
  onError?: (error: SwapError) => void; // An optional callback function that handles errors within the provider.
  onStatus?: (lifecycleStatus: LifecycleStatus) => void; // An optional callback function that exposes the component lifecycle state
  onSuccess?: (transactionReceipt?: TransactionReceipt) => void; // An optional callback function that exposes the transaction receipt
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
