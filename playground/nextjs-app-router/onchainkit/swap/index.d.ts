import * as react_jsx_runtime from 'react/jsx-runtime';
import { S as SwapReact, h as SwapAmountInputReact, i as SwapButtonReact, j as SwapDefaultReact, k as SwapMessageReact, l as SwapSettingsReact, m as SwapSettingsSlippageDescriptionReact, n as SwapSettingsSlippageInputReact, o as SwapSettingsSlippageTitleReact, p as SwapToastReact, q as SwapToggleButtonReact } from '../types-BRVO_IxW.js';
export { g as BuildSwapTransaction, a as BuildSwapTransactionResponse, F as Fee, L as LifecycleStatus, Q as QuoteWarning, r as SwapError, s as SwapQuote, t as SwapTransactionType, T as Transaction } from '../types-BRVO_IxW.js';
import 'viem';
import 'react';
import '../types-C3pTIy0E.js';

declare function Swap({ children, config, className, experimental, isSponsored, onError, onStatus, onSuccess, title, }: SwapReact): react_jsx_runtime.JSX.Element | null;

declare function SwapAmountInput({ className, delayMs, label, token, type, swappableTokens, }: SwapAmountInputReact): react_jsx_runtime.JSX.Element;

declare function SwapButton({ className, disabled }: SwapButtonReact): react_jsx_runtime.JSX.Element;

declare function SwapDefault({ config, className, disabled, experimental, from, isSponsored, onError, onStatus, onSuccess, title, to, }: SwapDefaultReact): react_jsx_runtime.JSX.Element;

declare function SwapMessage({ className }: SwapMessageReact): react_jsx_runtime.JSX.Element;

declare function SwapSettings({ children, className, icon, text: buttonText, }: SwapSettingsReact): react_jsx_runtime.JSX.Element;

declare function SwapSettingsSlippageDescription({ children, className, }: SwapSettingsSlippageDescriptionReact): react_jsx_runtime.JSX.Element;

declare function SwapSettingsSlippageInput({ className, }: SwapSettingsSlippageInputReact): react_jsx_runtime.JSX.Element;

declare function SwapSettingsSlippageTitle({ children, className, }: SwapSettingsSlippageTitleReact): react_jsx_runtime.JSX.Element;

declare function SwapToast({ className, durationMs, position, }: SwapToastReact): react_jsx_runtime.JSX.Element | null;

declare function SwapToggleButton({ className }: SwapToggleButtonReact): react_jsx_runtime.JSX.Element;

export { Swap, SwapAmountInput, SwapAmountInputReact, SwapButton, SwapButtonReact, SwapDefault, SwapMessage, SwapMessageReact, SwapReact, SwapSettings, SwapSettingsReact, SwapSettingsSlippageDescription, SwapSettingsSlippageDescriptionReact, SwapSettingsSlippageInput, SwapSettingsSlippageInputReact, SwapSettingsSlippageTitle, SwapSettingsSlippageTitleReact, SwapToast, SwapToggleButton, SwapToggleButtonReact };
