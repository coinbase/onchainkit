import { ReactNode } from 'react';
import { Address, Chain } from 'viem';
import { E as EASSchemaUid } from './types-C9oyc1o7.js';
import * as react_jsx_runtime from 'react/jsx-runtime';

/**
 * Note: exported as public Type
 */
type AppConfig = {
    appearance?: {
        name?: string | null;
        logo?: string | null;
        mode?: Mode | null;
        theme?: ComponentTheme | null;
    };
    paymaster?: string | null;
};
/**
 * Note: exported as public Type
 */
type isBaseOptions = {
    chainId: number;
    isMainnetOnly?: boolean;
};
/**
 * Note: exported as public Type
 */
type isEthereumOptions = {
    chainId: number;
    isMainnetOnly?: boolean;
};
type Mode = 'auto' | 'light' | 'dark';
type ComponentTheme = 'base' | 'cyberpunk' | 'default' | 'hacker' | string;
/**
 * Note: exported as public Type
 */
type OnchainKitConfig = {
    address: Address | null;
    apiKey: string | null;
    chain: Chain;
    config?: AppConfig;
    rpcUrl: string | null;
    schemaId: EASSchemaUid | null;
    projectId: string | null;
};
type SetOnchainKitConfig = Partial<OnchainKitConfig>;
/**
 * Note: exported as public Type
 */
type OnchainKitContextType = OnchainKitConfig;
/**
 * Note: exported as public Type
 */
type OnchainKitProviderReact = {
    address?: Address;
    apiKey?: string;
    chain: Chain;
    children: ReactNode;
    config?: AppConfig;
    rpcUrl?: string;
    schemaId?: EASSchemaUid;
    projectId?: string;
};

/**
 * isBase
 *  - Checks if the paymaster operations chain id is valid
 *  - Only allows the Base and Base Sepolia chain ids
 */
declare function isBase({ chainId, isMainnetOnly, }: isBaseOptions): boolean;

/**
 * isEthereum
 *  - Checks if the chain is mainnet or sepolia
 */
declare function isEthereum({ chainId, isMainnetOnly, }: isEthereumOptions): boolean;

/**
 * Access the ONCHAIN_KIT_CONFIG object directly by providing the key.
 * This is powerful when you use OnchainKit utilities outside of the React context.
 */
declare const getOnchainKitConfig: <K extends keyof OnchainKitConfig>(configName: K) => OnchainKitConfig[K];
/**
 * Update the ONCHAIN_KIT_CONFIG object directly by providing the properties to update.
 * This is powerful when you use OnchainKit utilities outside of the React context.
 */
declare const setOnchainKitConfig: (properties: SetOnchainKitConfig) => <K extends keyof OnchainKitConfig>(configName: K) => OnchainKitConfig[K];

/**
 * Provides the OnchainKit React Context to the app.
 */
declare function OnchainKitProvider({ address, apiKey, chain, children, config, projectId, rpcUrl, schemaId, }: OnchainKitProviderReact): react_jsx_runtime.JSX.Element;

declare function useOnchainKit(): OnchainKitConfig;

declare const version = "0.35.2";

export { type AppConfig, type OnchainKitConfig, type OnchainKitContextType, OnchainKitProvider, type OnchainKitProviderReact, getOnchainKitConfig, isBase, type isBaseOptions, isEthereum, type isEthereumOptions, setOnchainKitConfig, useOnchainKit, version };
