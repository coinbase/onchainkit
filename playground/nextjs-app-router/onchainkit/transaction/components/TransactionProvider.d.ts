/// <reference types="react" />
import type { TransactionContextType, TransactionProviderReact } from '../types';
export declare const TransactionContext: import("react").Context<TransactionContextType>;
export declare function useTransactionContext(): TransactionContextType;
export declare function TransactionProvider({ calls, capabilities: transactionCapabilities, chainId, children, contracts, isSponsored, onError, onStatus, onSuccess, }: TransactionProviderReact): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=TransactionProvider.d.ts.map