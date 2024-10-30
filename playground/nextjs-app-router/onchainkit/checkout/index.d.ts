import * as react_jsx_runtime from 'react/jsx-runtime';
import { ContractFunctionParameters, TransactionReceipt } from 'viem';
import { T as TransactionError } from '../types-CAfIXkWi.js';
import 'react';

/**
 * List of Pay lifecycle statuses.
 * The order of the statuses loosely follows the transaction lifecycle.
 *
 * Note: exported as public Type
 */
type LifecycleStatus = {
    statusName: 'init';
    statusData: LifecycleStatusDataShared;
} | {
    statusName: 'error';
    statusData: TransactionError;
} | {
    statusName: 'fetchingData';
    statusData: LifecycleStatusDataShared;
} | {
    statusName: 'ready';
    statusData: {
        chargeId: string;
        contracts: ContractFunctionParameters[];
    };
} | {
    statusName: 'pending';
    statusData: LifecycleStatusDataShared;
} | {
    statusName: 'success';
    statusData: {
        transactionReceipts: TransactionReceipt[];
        chargeId: string;
        receiptUrl: string;
    };
};
type LifecycleStatusDataShared = Record<string, never>;
/**
 * Note: exported as public Type
 */
type CheckoutButtonReact = {
    className?: string;
    coinbaseBranded?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    text?: string;
};
/**
 * Note: exported as public Type
 */
type CheckoutReact = {
    chargeHandler?: () => Promise<string>;
    children: React.ReactNode;
    className?: string;
    isSponsored?: boolean;
    onStatus?: (status: LifecycleStatus) => void;
    productId?: string;
};
/**
 * Note: exported as public Type
 */
type CheckoutStatusReact = {
    className?: string;
};

declare function Checkout({ chargeHandler, children, className, isSponsored, onStatus, productId, }: CheckoutReact): react_jsx_runtime.JSX.Element | null;

declare function CheckoutButton({ className, coinbaseBranded, disabled, icon, text, }: CheckoutButtonReact): react_jsx_runtime.JSX.Element;

declare function CheckoutStatus({ className }: CheckoutStatusReact): react_jsx_runtime.JSX.Element;

export { Checkout, CheckoutButton, type CheckoutButtonReact, type CheckoutReact, CheckoutStatus, type CheckoutStatusReact, type LifecycleStatus };
