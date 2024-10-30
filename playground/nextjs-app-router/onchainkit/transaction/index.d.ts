import * as react_jsx_runtime from 'react/jsx-runtime';
import { b as TransactionReact, a as TransactionButtonReact, c as TransactionDefaultReact, d as TransactionSponsorReact, e as TransactionStatusReact, f as TransactionStatusActionReact, g as TransactionStatusLabelReact, h as TransactionToastReact, i as TransactionToastIconReact, j as TransactionToastActionReact, k as TransactionToastLabelReact } from '../types-CAfIXkWi.js';
export { L as LifecycleStatus, T as TransactionError, l as TransactionResponse, W as WalletCapabilities } from '../types-CAfIXkWi.js';
import 'react';
import 'viem';

declare function Transaction({ calls, capabilities, chainId, className, children, contracts, isSponsored, onError, onStatus, onSuccess, }: TransactionReact): react_jsx_runtime.JSX.Element | null;

declare function TransactionButton({ className, disabled, text: idleText, errorOverride, successOverride, pendingOverride, }: TransactionButtonReact): react_jsx_runtime.JSX.Element;

declare function TransactionDefault({ calls, capabilities, chainId, className, contracts, disabled, onError, onStatus, onSuccess, }: TransactionDefaultReact): react_jsx_runtime.JSX.Element;

declare function TransactionSponsor({ className }: TransactionSponsorReact): react_jsx_runtime.JSX.Element | null;

declare function TransactionStatus({ children, className, }: TransactionStatusReact): react_jsx_runtime.JSX.Element;

declare function TransactionStatusAction({ className, }: TransactionStatusActionReact): react_jsx_runtime.JSX.Element;

declare function TransactionStatusLabel({ className, }: TransactionStatusLabelReact): react_jsx_runtime.JSX.Element;

declare function TransactionToast({ children, className, durationMs, position, }: TransactionToastReact): react_jsx_runtime.JSX.Element | null;

declare function TransactionToastIcon({ className }: TransactionToastIconReact): react_jsx_runtime.JSX.Element | null;

declare function TransactionToastAction({ className, }: TransactionToastActionReact): react_jsx_runtime.JSX.Element;

declare function TransactionToastLabel({ className, }: TransactionToastLabelReact): react_jsx_runtime.JSX.Element;

export { Transaction, TransactionButton, TransactionButtonReact, TransactionDefault, TransactionReact, TransactionSponsor, TransactionSponsorReact, TransactionStatus, TransactionStatusAction, TransactionStatusActionReact, TransactionStatusLabel, TransactionStatusLabelReact, TransactionStatusReact, TransactionToast, TransactionToastAction, TransactionToastActionReact, TransactionToastIcon, TransactionToastIconReact, TransactionToastLabel, TransactionToastLabelReact, TransactionToastReact };
