import type { ReactNode } from 'react';
import type { Address, Chain } from 'viem';
import type { EASSchemaUid } from './identity/types';
/**
 * Note: exported as public Type
 */
export type AppConfig = {
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
export type isBaseOptions = {
    chainId: number;
    isMainnetOnly?: boolean;
};
/**
 * Note: exported as public Type
 */
export type isEthereumOptions = {
    chainId: number;
    isMainnetOnly?: boolean;
};
export type Mode = 'auto' | 'light' | 'dark';
export type ComponentTheme = 'base' | 'cyberpunk' | 'default' | 'hacker' | string;
export type UseThemeReact = 'base' | 'cyberpunk' | 'default' | 'hacker' | 'default-light' | 'default-dark' | string;
/**
 * Note: exported as public Type
 */
export type OnchainKitConfig = {
    address: Address | null;
    apiKey: string | null;
    chain: Chain;
    config?: AppConfig;
    rpcUrl: string | null;
    schemaId: EASSchemaUid | null;
    projectId: string | null;
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
    config?: AppConfig;
    rpcUrl?: string;
    schemaId?: EASSchemaUid;
    projectId?: string;
};
export type UseCapabilitiesSafeParams = {
    chainId: number;
};
//# sourceMappingURL=types.d.ts.map