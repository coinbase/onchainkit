import type { EASSchemaUid } from '@/identity/types';
import type { Address, Chain } from 'viem';
import type { CreateConnectorFn } from 'wagmi';
import { type CoinbaseWalletParameters } from 'wagmi/connectors';

/**
 * Note: exported as public Type
 */
export type AppConfig = {
  /** Enable/disable telemetry. Set to false to disable telemetry. Defaults to true (enabled) */
  analytics?: boolean;
  /** Optional analytics URL for analytics data, defaults to Coinbase */
  analyticsUrl?: string | null;
  appearance?: {
    /** The name of your application */
    name?: string | null;
    /** The URL of your application logo */
    logo?: string | null;
    /** Optionally determines color scheme based on OS preference or user selection */
    mode?: Mode | null;
    /** Optionally sets the visual style for components */
    theme?: ComponentTheme | null;
  };
  /** Paymaster URL for gas sponsorship */
  paymaster?: string | null;
  wallet?: {
    /** Determines the display style of the wallet modal */
    display?: ConnectWalletDisplay | null;
    /** Preference for the type of wallet to display for the Coinbase connector. Defaults to 'all' */
    preference?: Extract<CoinbaseWalletParameters<'4'>['preference'], string>;
    /** Enable/disable sign up in the wallet modal. Defaults to true*/
    signUpEnabled?: boolean;
    /** URL to the terms of service for the wallet modal */
    termsUrl?: string | null;
    /** URL to the privacy policy for the wallet modal */
    privacyUrl?: string | null;
    /**
     * Supported wallets for the wallet modal.
     * By default, the wallet modal automatically supports Coinbase, Metamask, and Phantom.
     * Additional wallets can be enabled through this config.
     */
    supportedWallets?: {
      rabby?: boolean;
      trust?: boolean;
      frame?: boolean;
    };
  };
};

export type CreateWagmiConfigParams = {
  /** API key for configuration */
  apiKey?: string;
  /** Application name */
  appName?: string;
  /** Application logo URL */
  appLogoUrl?: string;
  /** Connectors to use, defaults to coinbaseWallet */
  connectors?: CreateConnectorFn[];
};

/**
 * Note: exported as public Type
 */
export type IsBaseOptions = {
  /** Chain ID for the network */
  chainId: number;
  /** If the chainId check is only allowed on mainnet */
  isMainnetOnly?: boolean;
};

/**
 * @deprecated Use IsBaseOptions instead
 */
export type isBaseOptions = IsBaseOptions;

/**
 * Note: exported as public Type
 */
export type IsEthereumOptions = {
  /** Chain ID for the network */
  chainId: number;
  /** If the chainId check is only allowed on mainnet */
  isMainnetOnly?: boolean;
};

/**
 * @deprecated Use IsEthereumOptions instead
 */
export type isEthereumOptions = IsEthereumOptions;

export type Mode = 'auto' | 'light' | 'dark';

/**
 * External theme options for users
 */
export type ComponentTheme =
  | 'base'
  | 'cyberpunk'
  | 'default'
  | 'hacker'
  | string;

/**
 * Internal theme options, including light/dark variants for 'default'
 */
export type UseThemeReact =
  | 'base-light'
  | 'base-dark'
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
  /** Address is optional as we may not have an address for new users */
  address: Address | null;
  /** ApiKey for Coinbase Developer Platform APIs */
  apiKey: string | null;
  /** Chain must be provided as we need to know which chain to use */
  chain: Chain;
  /** Configuration options for the app */
  config?: AppConfig;
  /** RPC URL for onchain requests. Defaults to using CDP Node if the API Key is set */
  rpcUrl: string | null;
  /** SchemaId is optional as not all apps need to use EAS */
  schemaId: EASSchemaUid | null;
  /** ProjectId from Coinbase Developer Platform, only required for Coinbase Onramp support */
  projectId: string | null;
  /** SessionId, used for analytics */
  sessionId: string | null;
};

export type SetOnchainKitConfig = Partial<OnchainKitConfig>;

/**
 * Note: exported as public Type
 */
export type OnchainKitContextType = OnchainKitConfig;

export type UseCapabilitiesSafeParams = {
  /** Chain ID for the network */
  chainId: number;
};

export type ConnectWalletDisplay = 'modal' | 'classic';
