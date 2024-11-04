import type { OnchainKitConfig, SetOnchainKitConfig } from './types';
export declare const ONCHAIN_KIT_CONFIG: OnchainKitConfig;
/**
 * Access the ONCHAIN_KIT_CONFIG object directly by providing the key.
 * This is powerful when you use OnchainKit utilities outside of the React context.
 */
export declare const getOnchainKitConfig: <K extends keyof OnchainKitConfig>(configName: K) => OnchainKitConfig[K];
/**
 * Update the ONCHAIN_KIT_CONFIG object directly by providing the properties to update.
 * This is powerful when you use OnchainKit utilities outside of the React context.
 */
export declare const setOnchainKitConfig: (properties: SetOnchainKitConfig) => <K extends keyof OnchainKitConfig>(configName: K) => OnchainKitConfig[K];
//# sourceMappingURL=OnchainKitConfig.d.ts.map