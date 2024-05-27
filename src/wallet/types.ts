import type { UserOperation } from 'permissionless';
import { PublicClient } from 'viem';

/**
 * Note: exported as public Type
 */
export type ConnectAccountReact = {
  children?: React.ReactNode; // Children can be utilized to display customized content when the wallet is connected.
};

export type IsValidSponsorTransactionOptions = {
  chainId: number;
  client: PublicClient;
  entrypoint: string;
  userOp: UserOperation<'v0.6'>;
};

export type IsValidSponsorTransactionResponse =
  | { isValid: true }
  | { isValid: false; error: string; code: number };
