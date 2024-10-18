import type { ReactNode } from 'react';
import type { Address, Chain } from 'viem';
import type { EASSchemaUid } from './identity/types';

/**
 * Note: exported as public Type
 */
export type isBaseOptions = {
  chainId: number;
  isMainnetOnly?: boolean; // If the chainId check is only allowed on mainnet
};

/**
 * Note: exported as public Type
 */
export type isEthereumOptions = {
  chainId: number;
  isMainnetOnly?: boolean; // If the chainId check is only allowed on mainnet
};

export type Mode = 'auto' | 'light' | 'dark';

// External theme options for users
export type ComponentTheme =
  | 'base'
  | 'cyberpunk'
  | 'default'
  | 'hacker'
  | string;

// Internal theme options, including light/dark variants for 'default'
export type UseThemeReact =
  | 'base'
  | 'cyberpunk'
  | 'default'
  | 'hacker'
  | 'default-light'
  | 'default-dark'
  | string;

/**
 * Note: exported as public Type
 */
export type OnchainKitConfig = {
  address: Address | null; // Address is optional as we may not have an address for new users
  apiKey: string | null; // ApiKey for Coinbase Developer Platform APIs
  chain: Chain; // Chain must be provided as we need to know which chain to use
  config?: {
    appearance?: {
      mode?: Mode | null; // Optionally determines color scheme based on OS preference or user selection
      theme?: ComponentTheme | null; // Optionally sets the visual style for components
    };
    paymaster?: string | null; // Paymaster URL for sponsorship
  };
  rpcUrl: string | null; // RPC URL for onchain requests. Defaults to using CDP Node if the API Key is set
  schemaId: EASSchemaUid | null; // SchemaId is optional as not all apps need to use EAS
  projectId: string | null; // ProjectId from Coinbase Developer Platform, only required for Coinbase Onramp support
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
  config?: {
    appearance?: {
      name?: string | null;
      logo?: string | null;
      mode?: Mode | null;
      theme?: ComponentTheme | null;
    };
    paymaster?: string;
  };
  rpcUrl?: string;
  schemaId?: EASSchemaUid;
  projectId?: string;
};

export type UseCapabilitiesSafeParams = {
  chainId: number;
};
