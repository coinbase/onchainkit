import { ReactNode } from 'react';
import { Address, TransactionReceipt, ContractFunctionParameters, Hex } from 'viem';

type Call = {
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
type LifecycleStatus = {
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
/**
 * Note: exported as public Type
 */
type TransactionButtonReact = {
    className?: string;
    disabled?: boolean;
    text?: ReactNode;
    errorOverride?: TransactionButtonOverride;
    successOverride?: TransactionButtonOverride;
    pendingOverride?: Pick<TransactionButtonOverride, 'text'>;
};
type PaymasterService = {
    url: string;
};
/**
 * Note: exported as public Type
 */
type TransactionDefaultReact = {
    disabled?: boolean;
} & Omit<TransactionReact, 'children'>;
/**
 * Note: exported as public Type
 */
type TransactionError = {
    code: string;
    error: string;
    message: string;
};
type Calls = Call[] | Promise<Call[]> | (() => Promise<Call[]>);
type Contracts = ContractFunctionParameters[] | Promise<ContractFunctionParameters[]> | (() => Promise<ContractFunctionParameters[]>);
/**
 * Note: exported as public Type
 */
type TransactionReact = {
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
type TransactionResponse = {
    transactionReceipts: TransactionReceipt[];
};
/**
 * Note: exported as public Type
 */
type TransactionSponsorReact = {
    className?: string;
};
/**
 * Note: exported as public Type
 */
type TransactionStatusReact = {
    children: ReactNode;
    className?: string;
};
/**
 * Note: exported as public Type
 */
type TransactionStatusActionReact = {
    className?: string;
};
/**
 * Note: exported as public Type
 */
type TransactionStatusLabelReact = {
    className?: string;
};
/**
 * Note: exported as public Type
 */
type TransactionToastReact = {
    children: ReactNode;
    className?: string;
    durationMs?: number;
    position?: 'top-center' | 'top-right' | 'bottom-center' | 'bottom-right';
};
/**
 * Note: exported as public Type
 */
type TransactionToastActionReact = {
    className?: string;
};
/**
 * Note: exported as public Type
 */
type TransactionToastIconReact = {
    className?: string;
};
/**
 * Note: exported as public Type
 */
type TransactionToastLabelReact = {
    className?: string;
};
/**
 * Note: exported as public Type
 *
 * Wallet capabilities configuration
 */
type WalletCapabilities = {
    paymasterService?: PaymasterService;
};

export type { Call as C, LifecycleStatus as L, TransactionError as T, WalletCapabilities as W, TransactionButtonReact as a, TransactionReact as b, TransactionDefaultReact as c, TransactionSponsorReact as d, TransactionStatusReact as e, TransactionStatusActionReact as f, TransactionStatusLabelReact as g, TransactionToastReact as h, TransactionToastIconReact as i, TransactionToastActionReact as j, TransactionToastLabelReact as k, TransactionResponse as l };
