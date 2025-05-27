import type { Portfolio, PortfolioTokenWithFiatValue } from '@/api/types';
import type { SwapError } from '@/swap';
import type { SwapDefaultReact } from '@/swap/types';
import type { Token } from '@/token';
import type { QueryObserverResult } from '@tanstack/react-query';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { RpcUserOperation, Address, Chain, PublicClient } from 'viem';
import type { UseBalanceReturnType, UseReadContractReturnType } from 'wagmi';

export type ConnectButtonReact = {
  /** Optional className override for button element */
  className?: string;
  /** Optional text override for button */
  connectWalletText: ReactNode | null;
  /** Function to call when the button is clicked */
  onClick: () => void;
  /** Optional text override for button */
  text: string;
};

/**
 * Note: exported as public Type
 */
export type ConnectWalletReact = {
  /** Children can be utilized to display customized content when the wallet is connected. */
  children?: React.ReactNode;
  /** Optional className override for button element */
  className?: string;
  /** @deprecated Prefer `ConnectWalletText component` */
  text?: string;
  /** Optional callback function to execute when the wallet is connected. */
  onConnect?: () => void;
  /** Optional disconnected display override */
  disconnectedLabel?: React.ReactNode;
};

/**
 * Note: exported as public Type
 */
export type ConnectWalletTextReact = {
  /** The text to display */
  children: React.ReactNode;
  /** Optional className override for the element */
  className?: string;
};

/**
 * Note: exported as public Type
 */
export type IsValidAAEntrypointOptions = {
  entrypoint: string;
};

/**
 * Note: exported as public Type
 */
export type IsWalletACoinbaseSmartWalletOptions = {
  client: PublicClient;
  userOp: RpcUserOperation<'0.6'>;
};

/**
 * Note: exported as public Type
 */
export type IsWalletACoinbaseSmartWalletResponse =
  | { isCoinbaseSmartWallet: true }
  | { isCoinbaseSmartWallet: false; error: string; code: string };

export type UseGetETHBalanceResponse = {
  error?: SwapError;
  response?: UseBalanceReturnType;
  convertedBalance?: string;
  roundedBalance?: string;
};

export type UseGetTokenBalanceResponse = {
  error?: SwapError;
  response?: UseReadContractReturnType;
  convertedBalance?: string;
  roundedBalance?: string;
  status: UseReadContractReturnType['status'];
  refetch: UseReadContractReturnType['refetch'];
};

/**
 * Note: exported as public Type
 */
export type WalletContextType = {
  /** The Ethereum address to fetch the avatar and name for. */
  address?: Address | null;
  /** Optional chain for domain resolution */
  chain?: Chain;
  /** The breakpoint of the current device */
  breakpoint: string | undefined;
  /** Whether the connect modal is open */
  isConnectModalOpen: boolean;
  setIsConnectModalOpen: Dispatch<SetStateAction<boolean>>;
  isSubComponentOpen: boolean;
  setIsSubComponentOpen: Dispatch<SetStateAction<boolean>>;
  isSubComponentClosing: boolean;
  setIsSubComponentClosing: Dispatch<SetStateAction<boolean>>;
  handleClose: () => void;
  connectRef: React.RefObject<HTMLDivElement>;
  showSubComponentAbove: boolean;
  alignSubComponentRight: boolean;

  activeFeature: WalletAdvancedFeature | null;
  setActiveFeature: Dispatch<SetStateAction<WalletAdvancedFeature | null>>;
  isActiveFeatureClosing: boolean;
  setIsActiveFeatureClosing: Dispatch<SetStateAction<boolean>>;
  animations: {
    container: string;
    content: string;
  };
  /** Whether to sponsor transactions for Send feature of advanced wallet implementation */
  isSponsored?: boolean;
};

/**
 * Note: exported as public Type
 */
export type WalletReact = {
  children?: React.ReactNode;
  /** Whether to sponsor transactions for Send feature of advanced wallet implementation */
  isSponsored?: boolean;
  className?: string;
} & (
  | { draggable?: true; draggableStartingPosition?: { x: number; y: number } }
  | { draggable?: false; draggableStartingPosition?: never }
);

/**
 * Note: exported as public Type
 */
export type WalletBottomSheetReact = {
  children: React.ReactNode;
  /** Optional className override for top div element */
  className?: string;
};

/**
 * Note: exported as public Type
 */
export type WalletDropdownBasenameReact = {
  /** Optional className override for the element */
  className?: string;
};

/**
 * Note: exported as public Type
 */
export type WalletDropdownReact = {
  children?: React.ReactNode;
  /** Optional className override for top div element */
  className?: string;
  classNames?: {
    container?: string;
    qr?: WalletAdvancedQrReceiveProps['classNames'];
    swap?: WalletAdvancedSwapProps['classNames'];
  };
  swappableTokens?: Token[];
};

/**
 * Note: exported as public Type
 */
export type WalletDropdownDisconnectReact = {
  /** Optional className override for the element */
  className?: string;
  /** Optional text override for the button */
  text?: string;
};

/**
 * Note: exported as public Type
 */
export type WalletDropdownFundLinkReact = {
  /** Optional className override for the element */
  className?: string;
  /** Optional icon override */
  icon?: ReactNode;
  /** Whether to open the funding flow in a tab or a popup window */
  openIn?: 'popup' | 'tab';
  /**
   * Note: popupSize is only respected when providing your own funding link, or when a Coinbase Smart Wallet is
   * connected. For any other wallet popupSize will be ignored as the Coinbase Onramp widget requires a fixed size
   * popup window.
   */
  popupSize?: 'sm' | 'md' | 'lg';
  /** Specifies the relationship between the current document and the linked document */
  rel?: string;
  /** Where to open the target if `openIn` is set to tab */
  target?: string;
  /** Optional text override */
  text?: string;
  /** Optional funding URL override */
  fundingUrl?: string;
};

/**
 * Note: exported as public Type
 */
export type WalletDropdownLinkReact = {
  children: string;
  /** Optional className override for the element */
  className?: string;
  href: string;
  icon?: 'wallet' | ReactNode;
  rel?: string;
  target?: string;
};

/**
 * Note: exported as public Type
 */
export type WalletAdvancedReact = {
  children?: React.ReactNode;
  swappableTokens?: Token[];
  classNames?: {
    container?: string;
    qr?: WalletAdvancedQrReceiveProps['classNames'];
    swap?: WalletAdvancedSwapProps['classNames'];
  };
};

export type WalletAdvancedFeature = 'qr' | 'swap' | 'send';

/**
 * Note: exported as public Type
 */
export type WalletAdvancedContextType = {
  activeFeature: WalletAdvancedFeature | null;
  setActiveFeature: Dispatch<SetStateAction<WalletAdvancedFeature | null>>;
  isActiveFeatureClosing: boolean;
  setIsActiveFeatureClosing: Dispatch<SetStateAction<boolean>>;
  tokenBalances: PortfolioTokenWithFiatValue[] | undefined;
  portfolioFiatValue: number | undefined;
  isFetchingPortfolioData: boolean;
  portfolioDataUpdatedAt: number | undefined;
  refetchPortfolioData: () => Promise<QueryObserverResult<Portfolio, Error>>;
  animations: {
    container: string;
    content: string;
  };
};

export type WalletAdvancedQrReceiveProps = {
  classNames?: {
    container?: string;
    header?: string;
    copyButton?: string;
  };
};

export type WalletAdvancedSwapProps = {
  classNames?: {
    /** Optional className override for the swap container */
    container?: string;
    /** Optional className override for the swap settings component */
    settings?: {
      /** Optional className override for the swap settings container */
      container?: string;
      /** Optional className override for the swap settings title */
      slippageTitle?: string;
      /** Optional className override for the swap settings description */
      slippageDescription?: string;
      /** Optional className override for the swap settings input */
      slippageInput?: string;
    };
    /** Optional className override for the swap to amount input */
    toAmountInput?: string;
    /** Optional className override for the swap from amount input */
    fromAmountInput?: string;
    /** Optional className override for the swap toggle button */
    toggleButton?: string;
    /** Optional className override for the swap button */
    swapButton?: string;
    /** Optional className override for the swap message */
    message?: string;
    /** Optional className override for the swap toast */
    toast?: string;
  };
} & Omit<SwapDefaultReact, 'children' | 'className' | 'headerLeftContent'>;
