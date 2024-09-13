// 🌲☀🌲
import type { Address } from 'viem';

/**
 * Note: exported as public Type
 */
export type FormatAmountOptions = {
  locale?: string; // User locale (default: browser locale)
  minimumFractionDigits?: number; // Minimum fraction digits for number decimals
  maximumFractionDigits?: number; // Maximum fraction digits for number decimals
};

/**
 * Note: exported as public Type
 */
export type FormatAmountResponse = string; // See Number.prototype.toLocaleString for more info

/**
 * Note: exported as public Type
 */
export type Token = {
  address: Address | ''; // The address of the token contract, this value will be empty for native ETH
  chainId: number; // The chain id of the token contract
  decimals: number; // The number of token decimals
  image: string | null; // A string url of the token logo
  name: string;
  symbol: string; // A ticker symbol or shorthand, up to 11 characters
};

/**
 * Note: exported as public Type
 */
export type TokenChipReact = {
  token: Token; // Rendered token
  onClick?: (token: Token) => void;
  className?: string;
};

/**
 * Note: exported as public Type
 */
export type TokenImageReact = {
  className?: string; // Optional additional CSS class to apply to the component
  size?: number; // size of the image in px (default: 24)
  token: Token;
};

/**
 * Note: exported as public Type
 */
export type TokenRowReact = {
  amount?: string; // Token amount
  className?: string;
  hideImage?: boolean;
  hideSymbol?: boolean;
  onClick?: (token: Token) => void; // Component on click handler
  token: Token; // Rendered token
};

/**
 * Note: exported as public Type
 */
export type TokenSearchReact = {
  className?: string;
  delayMs?: number; // Debounce delay in milliseconds
  onChange: (value: string) => void; // Search callback function
};

/**
 * Note: exported as public Type
 */
export type TokenSelectButtonReact = {
  className?: string;
  isOpen: boolean; // Determines carot icon direction
  onClick: () => void; // Button on click handler
  token?: Token; // Selected token
};

/**
 * Note: exported as public Type
 */
export type TokenSelectDropdownReact = {
  options: Token[]; // List of tokens
  setToken: (token: Token) => void; // Token setter
  token?: Token; // Selected token
};

/**
 * Note: exported as public Type
 */
export type TokenSelectModalReact = {
  options: Token[]; // List of tokens
  setToken: (token: Token) => void; // Token setter
  token?: Token; // Selected token
};
