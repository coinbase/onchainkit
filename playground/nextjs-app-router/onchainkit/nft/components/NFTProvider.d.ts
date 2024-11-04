/// <reference types="react" />
import type { NFTContextType, NFTProviderReact } from '../types';
export declare const NFTContext: import("react").Context<NFTContextType>;
export declare function useNFTContext(): NFTContextType;
export declare function NFTProvider({ children, contractAddress, tokenId, isSponsored, useNFTData, buildMintTransaction, }: NFTProviderReact): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=NFTProvider.d.ts.map