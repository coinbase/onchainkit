import type { UserOperation } from 'permissionless';
import type { PublicClient } from 'viem';

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
export type IsWalletASmartWalletOptions = {
  client: PublicClient;
  userOp: UserOperation<'v0.6'>;
};

export type IsWalletASmartWalletResponse =
  | { isValid: true }
  | { isValid: false; error: string; code: string };
