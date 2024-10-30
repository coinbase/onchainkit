import { Address } from 'viem';

/**
 * Note: exported as public Type
 */
type FormatAmountOptions = {
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
};
/**
 * Note: exported as public Type
 */
type FormatAmountResponse = string;
/**
 * Note: exported as public Type
 */
type Token = {
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
type TokenChipReact = {
    token: Token;
    onClick?: (token: Token) => void;
    className?: string;
};
/**
 * Note: exported as public Type
 */
type TokenImageReact = {
    className?: string;
    size?: number;
    token: Token;
};
/**
 * Note: exported as public Type
 */
type TokenRowReact = {
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
type TokenSearchReact = {
    className?: string;
    delayMs?: number;
    onChange: (value: string) => void;
};
/**
 * Note: exported as public Type
 */
type TokenSelectButtonReact = {
    className?: string;
    isOpen: boolean;
    onClick: () => void;
    token?: Token;
};
/**
 * Note: exported as public Type
 */
type TokenSelectDropdownReact = {
    options: Token[];
    setToken: (token: Token) => void;
    token?: Token;
};
/**
 * Note: exported as public Type
 */
type TokenSelectModalReact = {
    options: Token[];
    setToken: (token: Token) => void;
    token?: Token;
};

export type { FormatAmountOptions as F, Token as T, TokenChipReact as a, TokenImageReact as b, TokenRowReact as c, TokenSearchReact as d, TokenSelectDropdownReact as e, TokenSelectModalReact as f, FormatAmountResponse as g, TokenSelectButtonReact as h };
