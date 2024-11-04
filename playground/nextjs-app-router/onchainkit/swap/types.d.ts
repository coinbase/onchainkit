import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { Address, Hex, TransactionReceipt, WalletCapabilities } from 'viem';
import type { Config, UseBalanceReturnType, UseReadContractReturnType } from 'wagmi';
import type { SendTransactionMutateAsync, SwitchChainMutateAsync } from 'wagmi/query';
import type { BuildSwapTransaction, RawTransactionData } from '../api/types';
import type { Token } from '../token/types';
import type { Call } from '../transaction/types';
export type SendSwapTransactionParams = {
    config: Config;
    isSponsored?: boolean;
    paymaster?: string;
    sendCallsAsync: any;
    sendTransactionAsync: SendTransactionMutateAsync<Config, unknown>;
    transactions: SwapTransaction[];
    updateLifecycleStatus: (state: LifecycleStatusUpdate) => void;
    walletCapabilities: WalletCapabilities;
};
export type SendSingleTransactionsParams = {
    config: Config;
    sendTransactionAsync: SendTransactionMutateAsync<Config, unknown>;
    transactions: SwapTransaction[];
    updateLifecycleStatus: (state: LifecycleStatusUpdate) => void;
};
/**
 * Note: exported as public Type
 */
export type Fee = {
    amount: string;
    baseAsset: Token;
    percentage: string;
};
export type FromTo = {
    from: SwapUnit;
    to: SwapUnit;
};
export type GetSwapMessageParams = {
    address?: Address;
    lifecycleStatus: LifecycleStatus;
    to: SwapUnit;
    from: SwapUnit;
};
/**
 * Note: exported as public Type
 */
export type QuoteWarning = {
    description?: string;
    message?: string;
    type?: string;
};
type LifecycleStatusDataShared = {
    isMissingRequiredField: boolean;
    maxSlippage: number;
};
/**
 * List of swap lifecycle statuses.
 * The order of the statuses loosely follows the swap lifecycle.
 *
 * Note: exported as public Type
 */
export type LifecycleStatus = {
    statusName: 'init';
    statusData: LifecycleStatusDataShared;
} | {
    statusName: 'error';
    statusData: SwapError & LifecycleStatusDataShared;
} | {
    statusName: 'amountChange';
    statusData: {
        amountFrom: string;
        amountTo: string;
        tokenFrom?: Token;
        tokenTo?: Token;
    } & LifecycleStatusDataShared;
} | {
    statusName: 'slippageChange';
    statusData: LifecycleStatusDataShared;
} | {
    statusName: 'transactionPending';
    statusData: LifecycleStatusDataShared;
} | {
    statusName: 'transactionApproved';
    statusData: {
        callsId?: Hex;
        transactionHash?: Hex;
        transactionType: SwapTransactionType;
    } & LifecycleStatusDataShared;
} | {
    statusName: 'success';
    statusData: {
        transactionReceipt: TransactionReceipt;
    } & LifecycleStatusDataShared;
};
type PartialKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>> extends infer O ? {
    [P in keyof O]: O[P];
} : never;
type AllKeysInShared<T> = keyof T extends keyof LifecycleStatusDataShared ? true : false;
/**
 * LifecycleStatus updater type
 * Used to type the statuses used to update LifecycleStatus
 * LifecycleStatusData is persisted across state updates allowing SharedData to be optional except for in init step
 */
export type LifecycleStatusUpdate = LifecycleStatus extends infer T ? T extends {
    statusName: infer N;
    statusData: infer D;
} ? {
    statusName: N;
} & (N extends 'init' ? {
    statusData: D;
} : AllKeysInShared<D> extends true ? {
    statusData?: PartialKeys<D, keyof D & keyof LifecycleStatusDataShared>;
} : {
    statusData: PartialKeys<D, keyof D & keyof LifecycleStatusDataShared>;
}) : never : never;
export type ProcessSwapTransactionParams = {
    chainId?: number;
    config: Config;
    isSponsored?: boolean;
    paymaster?: string;
    sendCallsAsync: any;
    sendTransactionAsync: SendTransactionMutateAsync<Config, unknown>;
    swapTransaction: BuildSwapTransaction;
    switchChainAsync: SwitchChainMutateAsync<Config, unknown>;
    updateLifecycleStatus: (state: LifecycleStatusUpdate) => void;
    useAggregator: boolean;
    walletCapabilities: WalletCapabilities;
};
/**
 * Note: exported as public Type
 */
export type SwapAmountInputReact = {
    className?: string;
    delayMs?: number;
    label: string;
    swappableTokens?: Token[];
    token?: Token;
    type: 'to' | 'from';
};
export type SwapAPIResponse = {
    approveTx?: RawTransactionData;
    chainId: string;
    fee: Fee;
    quote: SwapQuote;
    tx: RawTransactionData;
};
/**
 * Note: exported as public Type
 */
export type SwapButtonReact = {
    className?: string;
    disabled?: boolean;
};
type SwapConfig = {
    maxSlippage: number;
};
export type SwapContextType = {
    address?: Address;
    config: SwapConfig;
    from: SwapUnit;
    lifecycleStatus: LifecycleStatus;
    handleAmountChange: (t: 'from' | 'to', amount: string, st?: Token, dt?: Token) => void;
    handleSubmit: () => void;
    handleToggle: () => void;
    updateLifecycleStatus: (state: LifecycleStatusUpdate) => void;
    to: SwapUnit;
    isToastVisible?: boolean;
    setIsToastVisible?: (visible: boolean) => void;
    transactionHash?: string;
    setTransactionHash?: (hash: string) => void;
};
/**
 * Note: exported as public Type
 */
export type SwapError = {
    code: string;
    error: string;
    message: string;
};
export type SwapLoadingState = {
    isSwapLoading: boolean;
};
/**
 * Note: exported as public Type
 */
export type SwapMessageReact = {
    className?: string;
};
/**
 * Note: exported as public Type
 */
export type SwapQuote = {
    amountReference: string;
    from: Token;
    fromAmount: string;
    fromAmountUSD: string;
    hasHighPriceImpact: boolean;
    priceImpact: string;
    slippage: string;
    to: Token;
    toAmount: string;
    toAmountUSD: string;
    warning?: QuoteWarning;
};
export type SwapParams = {
    amount: string;
    fromAddress: Address;
    from: Token;
    to: Token;
};
export type SwapProviderReact = {
    children: React.ReactNode;
    config?: {
        maxSlippage: number;
    };
    experimental: {
        useAggregator: boolean;
    };
    isSponsored?: boolean;
    onError?: (error: SwapError) => void;
    onStatus?: (lifecycleStatus: LifecycleStatus) => void;
    onSuccess?: (transactionReceipt: TransactionReceipt) => void;
};
/**
 * Note: exported as public Type
 */
export type SwapReact = {
    children: ReactNode;
    className?: string;
    config?: SwapConfig;
    experimental?: {
        useAggregator: boolean;
    };
    isSponsored?: boolean;
    onError?: (error: SwapError) => void;
    onStatus?: (lifecycleStatus: LifecycleStatus) => void;
    onSuccess?: (transactionReceipt: TransactionReceipt) => void;
    title?: string;
};
/**
 * Note: exported as public Type
 */
export type SwapDefaultReact = {
    to: Token[];
    from: Token[];
    disabled?: boolean;
} & Omit<SwapReact, 'children'>;
/**
 * Note: exported as public Type
 */
export type SwapSettingsReact = {
    children: ReactNode;
    className?: string;
    icon?: ReactNode;
    text?: string;
};
/**
 * Note: exported as public Type
 */
export type SwapSettingsSlippageDescriptionReact = {
    children: ReactNode;
    className?: string;
};
/**
 * Note: exported as public Type
 */
export type SwapSettingsSlippageInputReact = {
    className?: string;
};
export type SwapSettingsSlippageLayoutReact = {
    children: ReactNode;
    className?: string;
};
/**
 * Note: exported as public Type
 */
export type SwapSettingsSlippageTitleReact = {
    children: ReactNode;
    className?: string;
};
/**
 * Note: exported as public Type
 */
export type SwapToggleButtonReact = {
    className?: string;
};
/**
 * Note: exported as public Type
 */
export type SwapTransactionType = 'Batched' | 'ERC20' | 'Permit2' | 'Swap';
export type SwapUnit = {
    amount: string;
    amountUSD: string;
    balance?: string;
    balanceResponse?: UseBalanceReturnType | UseReadContractReturnType;
    error?: SwapError;
    loading: boolean;
    setAmount: Dispatch<SetStateAction<string>>;
    setAmountUSD: Dispatch<SetStateAction<string>>;
    setLoading: Dispatch<SetStateAction<boolean>>;
    setToken: Dispatch<SetStateAction<Token | undefined>>;
    token: Token | undefined;
};
/**
 * Note: exported as public Type
 */
export type Transaction = {
    chainId: number;
    data: Hex;
    gas: bigint;
    maxFeePerGas?: bigint | undefined;
    maxPriorityFeePerGas?: bigint | undefined;
    nonce?: number;
    to: Address;
    value: bigint;
};
export type SwapToastReact = {
    className?: string;
    durationMs?: number;
    position?: 'top-center' | 'top-right' | 'bottom-center' | 'bottom-right';
};
export type SwapTransaction = {
    transaction: Call;
    transactionType: SwapTransactionType;
};
export type UseAwaitCallsParams = {
    accountConfig: Config;
    lifecycleStatus: LifecycleStatus;
    updateLifecycleStatus: (state: LifecycleStatusUpdate) => void;
};
export {};
//# sourceMappingURL=types.d.ts.map