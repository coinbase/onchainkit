import type { ReactNode } from 'react';
import type { Address, ContractFunctionParameters, Hex, TransactionReceipt } from 'viem';
import type { WalletCapabilities as ViemWalletCapabilities } from 'viem';
import type { Config } from 'wagmi';
import type { SendTransactionMutateAsync, WriteContractMutateAsync } from 'wagmi/query';
export type Call = {
    to: Hex;
    data?: Hex;
    value?: bigint;
};
type TransactionButtonOverride = {
    text?: ReactNode;
    onClick?: (receipt?: TransactionReceipt) => void;
};
/**
 * List of transaction lifecycle statuses.
 * The order of the statuses loosely follows the transaction lifecycle.
 *
 * Note: exported as public Type
 */
export type LifecycleStatus = {
    statusName: 'init';
    statusData: null;
} | {
    statusName: 'error';
    statusData: TransactionError;
} | {
    statusName: 'transactionIdle';
    statusData: null;
} | {
    statusName: 'buildingTransaction';
    statusData: null;
} | {
    statusName: 'transactionPending';
    statusData: null;
} | {
    statusName: 'transactionLegacyExecuted';
    statusData: {
        transactionHashList: Address[];
    };
} | {
    statusName: 'success';
    statusData: {
        transactionReceipts: TransactionReceipt[];
    };
};
export type IsSpinnerDisplayedProps = {
    errorMessage?: string;
    hasReceipt?: boolean;
    isInProgress?: boolean;
    transactionHash?: string;
    transactionId?: string;
};
/**
 * Note: exported as public Type
 */
export type TransactionButtonReact = {
    className?: string;
    disabled?: boolean;
    text?: ReactNode;
    errorOverride?: TransactionButtonOverride;
    successOverride?: TransactionButtonOverride;
    pendingOverride?: Pick<TransactionButtonOverride, 'text'>;
};
export type TransactionContextType = {
    chainId?: number;
    errorCode?: string;
    errorMessage?: string;
    isLoading: boolean;
    isToastVisible: boolean;
    onSubmit: () => void;
    paymasterUrl: string | null;
    receipt?: TransactionReceipt;
    lifecycleStatus: LifecycleStatus;
    setIsToastVisible: (isVisible: boolean) => void;
    setLifecycleStatus: (state: LifecycleStatus) => void;
    setTransactionId: (id: string) => void;
    transactions?: Calls | Contracts;
    transactionId?: string;
    transactionHash?: string;
    transactionCount?: number;
};
type PaymasterService = {
    url: string;
};
export type SendBatchedTransactionsParams = {
    capabilities?: WalletCapabilities;
    sendCallsAsync: any;
    transactions?: Call[] | ContractFunctionParameters[];
    transactionType: string;
    writeContractsAsync: any;
};
export type SendSingleTransactionParams = {
    sendCallAsync: SendTransactionMutateAsync<Config, unknown> | (() => void);
    transactions: Call[] | ContractFunctionParameters[];
    transactionType: string;
    writeContractAsync: WriteContractMutateAsync<Config, unknown> | (() => void);
};
/**
 * Note: exported as public Type
 */
export type TransactionDefaultReact = {
    disabled?: boolean;
} & Omit<TransactionReact, 'children'>;
/**
 * Note: exported as public Type
 */
export type TransactionError = {
    code: string;
    error: string;
    message: string;
};
type Calls = Call[] | Promise<Call[]> | (() => Promise<Call[]>);
type Contracts = ContractFunctionParameters[] | Promise<ContractFunctionParameters[]> | (() => Promise<ContractFunctionParameters[]>);
export type TransactionProviderReact = {
    calls?: Calls;
    /**
     * @deprecated Use `isSponsored` instead.
     */
    capabilities?: WalletCapabilities;
    chainId: number;
    children: ReactNode;
    contracts?: Contracts;
    isSponsored?: boolean;
    onError?: (e: TransactionError) => void;
    onStatus?: (lifecycleStatus: LifecycleStatus) => void;
    onSuccess?: (response: TransactionResponse) => void;
};
/**
 * Note: exported as public Type
 */
export type TransactionReact = {
    calls?: Calls;
    /**
     * @deprecated Use `isSponsored` instead.
     */
    capabilities?: WalletCapabilities;
    chainId?: number;
    children: ReactNode;
    className?: string;
    contracts?: Contracts;
    isSponsored?: boolean;
    onError?: (e: TransactionError) => void;
    onStatus?: (lifecycleStatus: LifecycleStatus) => void;
    onSuccess?: (response: TransactionResponse) => void;
};
/**
 * Note: exported as public Type
 */
export type TransactionResponse = {
    transactionReceipts: TransactionReceipt[];
};
/**
 * Note: exported as public Type
 */
export type TransactionSponsorReact = {
    className?: string;
};
/**
 * Note: exported as public Type
 */
export type TransactionStatusReact = {
    children: ReactNode;
    className?: string;
};
/**
 * Note: exported as public Type
 */
export type TransactionStatusActionReact = {
    className?: string;
};
/**
 * Note: exported as public Type
 */
export type TransactionStatusLabelReact = {
    className?: string;
};
/**
 * Note: exported as public Type
 */
export type TransactionToastReact = {
    children: ReactNode;
    className?: string;
    durationMs?: number;
    position?: 'top-center' | 'top-right' | 'bottom-center' | 'bottom-right';
};
/**
 * Note: exported as public Type
 */
export type TransactionToastActionReact = {
    className?: string;
};
/**
 * Note: exported as public Type
 */
export type TransactionToastIconReact = {
    className?: string;
};
/**
 * Note: exported as public Type
 */
export type TransactionToastLabelReact = {
    className?: string;
};
export type UseCallsStatusParams = {
    setLifecycleStatus: (state: LifecycleStatus) => void;
    transactionId: string;
};
export type UseWriteContractParams = {
    setLifecycleStatus: (state: LifecycleStatus) => void;
    transactionHashList: Address[];
};
export type UseWriteContractsParams = {
    setLifecycleStatus: (state: LifecycleStatus) => void;
    setTransactionId: (id: string) => void;
};
export type UseSendCallParams = {
    setLifecycleStatus: (state: LifecycleStatus) => void;
    transactionHashList: Address[];
};
export type UseSendCallsParams = {
    setLifecycleStatus: (state: LifecycleStatus) => void;
    setTransactionId: (id: string) => void;
};
export type UseSendWalletTransactionsParams = {
    capabilities?: WalletCapabilities;
    sendCallsAsync: any;
    sendCallAsync: SendTransactionMutateAsync<Config, unknown> | (() => void);
    transactionType: string;
    walletCapabilities: ViemWalletCapabilities;
    writeContractsAsync: any;
    writeContractAsync: WriteContractMutateAsync<Config, unknown> | (() => void);
};
/**
 * Note: exported as public Type
 *
 * Wallet capabilities configuration
 */
export type WalletCapabilities = {
    paymasterService?: PaymasterService;
};
export {};
//# sourceMappingURL=types.d.ts.map