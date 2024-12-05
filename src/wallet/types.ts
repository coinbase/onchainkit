import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { Address, Chain, PublicClient } from 'viem';
import type { UserOperation } from 'viem/_types/account-abstraction';
import type { UseBalanceReturnType, UseReadContractReturnType } from 'wagmi';
import type { SwapError } from '../swap';

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
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

/**
 * Note: exported as public Type
 */
export type WalletReact = {
  children: React.ReactNode;
  className?: string;
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
  icon?: 'wallet' & ReactNode;
  rel?: string;
  target?: string;
};
