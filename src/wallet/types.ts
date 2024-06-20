import type { UserOperation } from 'permissionless';
import type { Address, PublicClient } from 'viem';

/**
 * Note: exported as public Type
 */
export type ConnectAccountReact = {
  children?: React.ReactNode; // Children can be utilized to display customized content when the wallet is connected.
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
  userOp: UserOperation<'v0.6'>;
};

/**
 * Note: exported as public Type
 */
export type IsWalletACoinbaseSmartWalletResponse =
  | { isCoinbaseSmartWallet: true }
  | { isCoinbaseSmartWallet: false; error: string; code: string };

/**
 * Note: exported as public Type
 */
export type WalletContextType = {
  address?: Address | null; // The Ethereum address to fetch the avatar and name for.
};

/**
 * Note: exported as public Type
 */
export type WalletReact = {
  children: React.ReactNode;
};

/**
 * Note: exported as public Type
 */
export type WalletDropdownReact = {
  children: React.ReactNode;
};
