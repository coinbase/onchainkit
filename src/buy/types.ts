
import {
  LifecycleStatus,
  LifecycleStatusUpdate,
  SwapConfig,
  SwapError,
  SwapUnit,
} from '@/swap/types';
import { Token } from '@/token';
import { Address, TransactionReceipt } from 'viem';

export type BuyReact = {
  className?: string; // Optional className override for top div element.
  config?: SwapConfig;
  experimental?: {
    useAggregator: boolean; // Whether to use a DEX aggregator. (default: true)
  };
  isSponsored?: boolean; // An optional setting to sponsor swaps with a Paymaster. (default: false)
  onError?: (error: SwapError) => void; // An optional callback function that handles errors within the provider.
  onStatus?: (lifecycleStatus: LifecycleStatus) => void; // An optional callback function that exposes the component lifecycle state
  onSuccess?: (transactionReceipt: TransactionReceipt) => void; // An optional callback function that exposes the transaction receipt
  fromToken?: Token;
  toToken: Token;
  projectId: string; // Your CDP project ID found at https://portal.cdp.coinbase.com/
};

export type BuyContextType = {
  address?: Address; // Used to check if user is connected in SwapButton
  config: SwapConfig;
  fromETH: SwapUnit;
  fromUSDC: SwapUnit;
  lifecycleStatus: LifecycleStatus;
  handleAmountChange: (amount: string) => void;
  handleSubmit: (fromToken: SwapUnit) => void;
  updateLifecycleStatus: (state: LifecycleStatusUpdate) => void; // A function to set the lifecycle status of the component
  setTransactionHash: (hash: string) => void;
  fromToken?: Token;
  to?: SwapUnit;
  from?: SwapUnit;
  toToken: Token;
  transactionHash: string;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  projectId: string;
  startPopupMonitor: (popupWindow: Window) => void;
};

export type BuyProviderReact = {
  children: React.ReactNode;
  config?: {
    maxSlippage: number; // Maximum acceptable slippage for a swap. (default: 10) This is as a percent, not basis points
  };
  experimental: {
    useAggregator: boolean; // Whether to use a DEX aggregator. (default: true)
  };
  isSponsored?: boolean; // An optional setting to sponsor swaps with a Paymaster. (default: false)
  onError?: (error: SwapError) => void; // An optional callback function that handles errors within the provider.
  onStatus?: (lifecycleStatus: LifecycleStatus) => void; // An optional callback function that exposes the component lifecycle state
  onSuccess?: (transactionReceipt: TransactionReceipt) => void; // An optional callback function that exposes the transaction receipt
  fromToken?: Token;
  toToken: Token;
  projectId: string;
};

export type BuyTokens = {
  fromETH: SwapUnit;
  fromUSDC: SwapUnit;
  to: SwapUnit;
  from?: SwapUnit;
};
  