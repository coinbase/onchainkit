import type {
  PortfolioTokenBalances,
  PortfolioTokenWithFiatValue,
} from '@/api/types';
import type { SwapError } from '@/swap';
import type { Token } from '@/token';
import type { QueryObserverResult } from '@tanstack/react-query';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { Address, Chain, PublicClient } from 'viem';
import type { UserOperation } from 'viem/_types/account-abstraction';
import type { UseBalanceReturnType, UseReadContractReturnType } from 'wagmi';

export type ConnectButtonReact = {
  className?: string; // Optional className override for button element
  connectWalletText: ReactNode | null; // Optional text override for button
  onClick: () => void; // Function to call when the button is clicked
  text: string; // Optional text override for button
};

/**
 * Note: exported as public Type
 */
export type ConnectWalletReact = {
  children?: React.ReactNode; // Children can be utilized to display customized content when the wallet is connected.
  className?: string; // Optional className override for button element
  /** @deprecated Prefer `ConnectWalletText component` */
  text?: string; // Optional text override for button
  onConnect?: () => void; // Optional callback function to execute when the wallet is connected.
};

/**
 * Note: exported as public Type
 */
export type ConnectWalletTextReact = {
  children: React.ReactNode; // The text to display
  className?: string; // Optional className override for the element
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
  userOp: UserOperation<'0.6'>;
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
};

/**
 * Note: exported as public Type
 */
export type WalletContextType = {
  address?: Address | null; // The Ethereum address to fetch the avatar and name for.
  chain?: Chain; // Optional chain for domain resolution
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
};

/**
 * Note: exported as public Type
 */
export type WalletReact = {
  children: React.ReactNode;
  className?: string;
} & (
  | { draggable?: true; draggableStartingPosition?: { x: number; y: number } }
  | { draggable?: false; draggableStartingPosition?: never }
);

export type WalletSubComponentReact = {
  connect: React.ReactNode;
  connectRef: React.RefObject<HTMLDivElement>;
  dropdown: React.ReactNode;
  advanced: React.ReactNode;
  isSubComponentOpen: boolean;
  alignSubComponentRight: boolean;
  showSubComponentAbove: boolean;
};

/**
 * Note: exported as public Type
 */
export type WalletBottomSheetReact = {
  children: React.ReactNode;
  className?: string; // Optional className override for top div element
};

/**
 * Note: exported as public Type
 */
export type WalletDropdownBasenameReact = {
  className?: string; // Optional className override for the element
};

/**
 * Note: exported as public Type
 */
export type WalletDropdownReact = {
  children: React.ReactNode;
  className?: string; // Optional className override for top div element
};

/**
 * Note: exported as public Type
 */
export type WalletDropdownDisconnectReact = {
  className?: string; // Optional className override for the element
  text?: string; // Optional text override for the button
};

/**
 * Note: exported as public Type
 */
export type WalletDropdownFundLinkReact = {
  className?: string; // Optional className override for the element
  icon?: ReactNode; // Optional icon override
  openIn?: 'popup' | 'tab'; // Whether to open the funding flow in a tab or a popup window
  /**
   * Note: popupSize is only respected when providing your own funding link, or when a Coinbase Smart Wallet is
   * connected. For any other wallet popupSize will be ignored as the Coinbase Onramp widget requires a fixed size
   * popup window.
   */
  popupSize?: 'sm' | 'md' | 'lg'; // Size of the popup window if `openIn` is set to `popup`
  rel?: string; // Specifies the relationship between the current document and the linked document
  target?: string; // Where to open the target if `openIn` is set to tab
  text?: string; // Optional text override
  fundingUrl?: string; // Optional funding URL override
};

/**
 * Note: exported as public Type
 */
export type WalletDropdownLinkReact = {
  children: string;
  className?: string; // Optional className override for the element
  href: string;
  // TODO: fix this type - should be 'wallet' | ReactNode
  icon?: 'wallet' & ReactNode;
  rel?: string;
  target?: string;
};

/**
 * Note: exported as public Type
 */
export type WalletAdvancedReact = {
  children: React.ReactNode;
  swappableTokens?: Token[];
};

/**
 * Note: exported as public Type
 */
export type WalletAdvancedContextType = {
  showSwap: boolean;
  setShowSwap: Dispatch<SetStateAction<boolean>>;
  isSwapClosing: boolean;
  setIsSwapClosing: Dispatch<SetStateAction<boolean>>;
  showQr: boolean;
  setShowQr: Dispatch<SetStateAction<boolean>>;
  isQrClosing: boolean;
  setIsQrClosing: Dispatch<SetStateAction<boolean>>;
  tokenBalances: PortfolioTokenWithFiatValue[] | undefined;
  portfolioFiatValue: number | undefined;
  isFetchingPortfolioData: boolean;
  portfolioDataUpdatedAt: number | undefined;
  refetchPortfolioData: () => Promise<
    QueryObserverResult<PortfolioTokenBalances, Error>
  >;
  animations: {
    container: string;
    content: string;
  };
};
