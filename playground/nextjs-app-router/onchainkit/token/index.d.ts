import * as react_jsx_runtime from 'react/jsx-runtime';
import { a as TokenChipReact, b as TokenImageReact, c as TokenRowReact, d as TokenSearchReact, e as TokenSelectDropdownReact, f as TokenSelectModalReact, F as FormatAmountOptions, g as FormatAmountResponse } from '../types-C3pTIy0E.js';
export { T as Token, h as TokenSelectButtonReact } from '../types-C3pTIy0E.js';
import * as react from 'react';
import 'viem';

/**
 * Small button that display a given token symbol and image.
 *
 * WARNING: This component is under development and
 *          may change in the next few weeks.
 */
declare function TokenChip({ token, onClick, className }: TokenChipReact): react_jsx_runtime.JSX.Element;

declare function TokenImage({ className, size, token }: TokenImageReact): react_jsx_runtime.JSX.Element;

declare const TokenRow: react.NamedExoticComponent<TokenRowReact>;

declare function TokenSearch({ className, onChange, delayMs, }: TokenSearchReact): react_jsx_runtime.JSX.Element;

declare function TokenSelectDropdown({ options, setToken, token, }: TokenSelectDropdownReact): react_jsx_runtime.JSX.Element;

declare function TokenSelectModal({ options, setToken, token, }: TokenSelectModalReact): react_jsx_runtime.JSX.Element;

/**
 * Retrieves a list of tokens on Base.
 */
declare function formatAmount(amount: string | undefined, options?: FormatAmountOptions): FormatAmountResponse;

export { FormatAmountOptions, FormatAmountResponse, TokenChip, TokenChipReact, TokenImage, TokenImageReact, TokenRow, TokenRowReact, TokenSearch, TokenSearchReact, TokenSelectDropdown, TokenSelectDropdownReact, TokenSelectModal, TokenSelectModalReact, formatAmount };
