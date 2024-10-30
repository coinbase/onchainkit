import { Hex, TransactionReceipt, Address } from 'viem';
import { ReactNode } from 'react';
import { T as Token } from './types-C3pTIy0E.js';

/**
 * Note: exported as public Type
 */
type Fee = {
    amount: string;
    baseAsset: Token;
    percentage: string;
};
/**
 * Note: exported as public Type
 */
type QuoteWarning = {
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
type LifecycleStatus = {
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
/**
 * Note: exported as public Type
 */
type SwapAmountInputReact = {
    className?: string;
    delayMs?: number;
    label: string;
    swappableTokens?: Token[];
    token?: Token;
    type: 'to' | 'from';
};
/**
 * Note: exported as public Type
 */
type SwapButtonReact = {
    className?: string;
    disabled?: boolean;
};
type SwapConfig = {
    maxSlippage: number;
};
/**
 * Note: exported as public Type
 */
type SwapError = {
    code: string;
    error: string;
    message: string;
};
/**
 * Note: exported as public Type
 */
type SwapMessageReact = {
    className?: string;
};
/**
 * Note: exported as public Type
 */
type SwapQuote = {
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
/**
 * Note: exported as public Type
 */
type SwapReact = {
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
type SwapDefaultReact = {
    to: Token[];
    from: Token[];
    disabled?: boolean;
} & Omit<SwapReact, 'children'>;
/**
 * Note: exported as public Type
 */
type SwapSettingsReact = {
    children: ReactNode;
    className?: string;
    icon?: ReactNode;
    text?: string;
};
/**
 * Note: exported as public Type
 */
type SwapSettingsSlippageDescriptionReact = {
    children: ReactNode;
    className?: string;
};
/**
 * Note: exported as public Type
 */
type SwapSettingsSlippageInputReact = {
    className?: string;
};
/**
 * Note: exported as public Type
 */
type SwapSettingsSlippageTitleReact = {
    children: ReactNode;
    className?: string;
};
/**
 * Note: exported as public Type
 */
type SwapToggleButtonReact = {
    className?: string;
};
/**
 * Note: exported as public Type
 */
type SwapTransactionType = 'Batched' | 'ERC20' | 'Permit2' | 'Swap';
/**
 * Note: exported as public Type
 */
type Transaction = {
    chainId: number;
    data: Hex;
    gas: bigint;
    maxFeePerGas?: bigint | undefined;
    maxPriorityFeePerGas?: bigint | undefined;
    nonce?: number;
    to: Address;
    value: bigint;
};
type SwapToastReact = {
    className?: string;
    durationMs?: number;
    position?: 'top-center' | 'top-right' | 'bottom-center' | 'bottom-right';
};

/**
 * Note: exported as public Type
 */
type APIError = {
    code: string;
    error: string;
    message: string;
};
/**
 * Note: exported as public Type
 */
type BuildPayTransactionParams = {
    address: Address;
    chargeId?: string;
    productId?: string;
};
/**
 * Note: exported as public Type
 */
type BuildPayTransactionResponse = PayTransaction | APIError;
/**
 * Note: exported as public Type
 */
type BuildSwapTransaction = {
    approveTransaction?: Transaction;
    fee: Fee;
    quote: SwapQuote;
    transaction: Transaction;
    warning?: QuoteWarning;
};
/**
 * Note: exported as public Type
 */
type BuildSwapTransactionParams = GetSwapQuoteParams & {
    fromAddress: Address;
};
/**
 * Note: exported as public Type
 */
type BuildSwapTransactionResponse = BuildSwapTransaction | APIError;
/**
 * Note: exported as public Type
 */
type GetSwapQuoteParams = {
    amount: string;
    amountReference?: string;
    from: Token;
    isAmountInDecimals?: boolean;
    maxSlippage?: string;
    to: Token;
    useAggregator: boolean;
};
/**
 * Note: exported as public Type
 */
type GetSwapQuoteResponse = SwapQuote | APIError;
/**
 * Note: exported as public Type
 */
type GetTokensOptions = {
    limit?: string;
    page?: string;
    search?: string;
};
/**
 * Note: exported as public Type
 */
type GetTokensResponse = Token[] | APIError;
type PayTransaction = {
    id: string;
    callData: {
        deadline: string;
        feeAmount: string;
        id: string;
        operator: Address;
        prefix: Address;
        recipient: Address;
        recipientAmount: string;
        recipientCurrency: Address;
        refundDestination: Address;
        signature: Address;
    };
    metaData: {
        chainId: number;
        contractAddress: Address;
        sender: Address;
        settlementCurrencyAddress: Address;
    };
};

export type { APIError as A, BuildSwapTransactionParams as B, Fee as F, GetSwapQuoteParams as G, LifecycleStatus as L, QuoteWarning as Q, SwapReact as S, Transaction as T, BuildSwapTransactionResponse as a, BuildPayTransactionParams as b, BuildPayTransactionResponse as c, GetSwapQuoteResponse as d, GetTokensOptions as e, GetTokensResponse as f, BuildSwapTransaction as g, SwapAmountInputReact as h, SwapButtonReact as i, SwapDefaultReact as j, SwapMessageReact as k, SwapSettingsReact as l, SwapSettingsSlippageDescriptionReact as m, SwapSettingsSlippageInputReact as n, SwapSettingsSlippageTitleReact as o, SwapToastReact as p, SwapToggleButtonReact as q, SwapError as r, SwapQuote as s, SwapTransactionType as t };
