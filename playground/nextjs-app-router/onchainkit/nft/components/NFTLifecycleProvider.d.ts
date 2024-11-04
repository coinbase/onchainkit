/// <reference types="react" />
import type { NFTLifecycleContextType, NFTLifecycleProviderReact } from '../types';
export declare const NFTLifecycleContext: import("react").Context<NFTLifecycleContextType>;
export declare function useNFTLifecycleContext(): NFTLifecycleContextType;
export declare function NFTLifecycleProvider({ type, onStatus, onError, onSuccess, children, }: NFTLifecycleProviderReact): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=NFTLifecycleProvider.d.ts.map