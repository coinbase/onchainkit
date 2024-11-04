import type { Address } from 'viem';
/**
 * Note: exported as public Type
 */
export type FormatAmountOptions = {
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
};
/**
 * Note: exported as public Type
 */
export type FormatAmountResponse = string;
/**
 * Note: exported as public Type
 */
export type Token = {
    address: Address | '';
    chainId: number;
    decimals: number;
    image: string | null;
    name: string;
    symbol: string;
};
/**
 * Note: exported as public Type
 */
export type TokenChipReact = {
    token: Token;
    onClick?: (token: Token) => void;
    className?: string;
};
/**
 * Note: exported as public Type
 */
export type TokenImageReact = {
    className?: string;
    size?: number;
    token: Token;
};
/**
 * Note: exported as public Type
 */
export type TokenRowReact = {
    amount?: string;
    className?: string;
    hideImage?: boolean;
    hideSymbol?: boolean;
    onClick?: (token: Token) => void;
    token: Token;
};
/**
 * Note: exported as public Type
 */
export type TokenSearchReact = {
    className?: string;
    delayMs?: number;
    onChange: (value: string) => void;
};
/**
 * Note: exported as public Type
 */
export type TokenSelectButtonReact = {
    className?: string;
    isOpen: boolean;
    onClick: () => void;
    token?: Token;
};
/**
 * Note: exported as public Type
 */
export type TokenSelectDropdownReact = {
    options: Token[];
    setToken: (token: Token) => void;
    token?: Token;
};
/**
 * Note: exported as public Type
 */
export type TokenSelectModalReact = {
    options: Token[];
    setToken: (token: Token) => void;
    token?: Token;
};
//# sourceMappingURL=types.d.ts.map