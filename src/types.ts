import type { ReactNode } from 'react';
import type { Address, Chain } from 'viem';
import type { EASSchemaUid } from './identity/types';

/**
 * Note: exported as public Type
 */
export type isBaseOptions = {
  chainId: number;
};

/**
 * Note: exported as public Type
 */
export type isEthereumOptions = {
  chainId: number;
};

/**
 * Note: exported as public Type
 */
export type OnchainKitConfig = {
  address: Address | null; // Address is optional as we may not have an address for new users
  apiKey: string | null; // ApiKey for Coinbase Developer Platform APIs
  rpcUrl: string | null; // RPC URL for onchain requests. Defaults to using CDP Node if the API Key is set
  chain: Chain; // Chain must be provided as we need to know which chain to use
  schemaId: EASSchemaUid | null; // SchemaId is optional as not all apps need to use EAS
  walletCapabilities: WalletCapabilities; // Capabilities of the wallet - see EIP-5792
};

export type SetOnchainKitConfig = Partial<OnchainKitConfig>;

/**
 * Note: exported as public Type
 */
export type OnchainKitContextType = OnchainKitConfig;

/**
 * Note: exported as public Type
 */
export type OnchainKitProviderReact = {
  address?: Address;
  apiKey?: string;
  chain: Chain;
  children: ReactNode;
  rpcUrl?: string;
  schemaId?: EASSchemaUid;
};

export type UseCapabilitiesSafeParams = {
  chainId: number;
};

/**
 * Note: exported as public Type
 */
export type WalletCapabilities = {
  hasPaymasterService: boolean; // If the wallet supports ERC-4337 Paymasters for gas sponsorship
  hasAtomicBatch: boolean; // If the wallet supports atomic batching of transactions
  hasAuxiliaryFunds: boolean; // If the wallet supports auxiliary funding of accounts (e.g. Magic Spend)
};
