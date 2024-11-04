import type { UserOperation } from 'permissionless';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { Address, Chain, PublicClient } from 'viem';
import type { UseBalanceReturnType, UseReadContractReturnType } from 'wagmi';
import type { SwapError } from '../swap';
export type ConnectButtonReact = {
    className?: string;
    connectWalletText: ReactNode | null;
    onClick: () => void;
    text: string;
};
/**
 * Note: exported as public Type
 */
export type ConnectWalletReact = {
    children?: React.ReactNode;
    className?: string;
    /** @deprecated Prefer `ConnectWalletText component` */
    text?: string;
    withWalletAggregator?: boolean;
    onConnect?: () => void;
};
/**
 * Note: exported as public Type
 */
export type ConnectWalletTextReact = {
    children: React.ReactNode;
    className?: string;
};
/**
 * Note: exported as public Type
 */
export type IsValidAAEntrypointOptions = {
    entrypoint: string;
};
/**
 * Note: exported as public Type
 */
export type IsWalletACoinbaseSmartWalletOptions = {
    client: PublicClient;
    userOp: UserOperation<'v0.6'>;
};
/**
 * Note: exported as public Type
 */
export type IsWalletACoinbaseSmartWalletResponse = {
    isCoinbaseSmartWallet: true;
} | {
    isCoinbaseSmartWallet: false;
    error: string;
    code: string;
};
export type UseGetETHBalanceResponse = {
    error?: SwapError;
    response?: UseBalanceReturnType;
    convertedBalance?: string;
    roundedBalance?: string;
};
export type UseGetTokenBalanceResponse = {
    error?: SwapError;
    response?: UseReadContractReturnType;
    convertedBalance?: string;
    roundedBalance?: string;
};
/**
 * Note: exported as public Type
 */
export type WalletContextType = {
    address?: Address | null;
    chain?: Chain;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
};
/**
 * Note: exported as public Type
 */
export type WalletReact = {
    children: React.ReactNode;
    className?: string;
};
/**
 * Note: exported as public Type
 */
export type WalletBottomSheetReact = {
    children: React.ReactNode;
    className?: string;
};
/**
 * Note: exported as public Type
 */
export type WalletDropdownBasenameReact = {
    className?: string;
};
/**
 * Note: exported as public Type
 */
export type WalletDropdownReact = {
    children: React.ReactNode;
    className?: string;
};
/**
 * Note: exported as public Type
 */
export type WalletDropdownDisconnectReact = {
    className?: string;
    text?: string;
};
/**
 * Note: exported as public Type
 */
export type WalletDropdownFundLinkReact = {
    className?: string;
    icon?: ReactNode;
    openIn?: 'popup' | 'tab';
    /**
     * Note: popupSize is only respected when providing your own funding link, or when a Coinbase Smart Wallet is
     * connected. For any other wallet popupSize will be ignored as the Coinbase Onramp widget requires a fixed size
     * popup window.
     */
    popupSize?: 'sm' | 'md' | 'lg';
    rel?: string;
    target?: string;
    text?: string;
    fundingUrl?: string;
};
/**
 * Note: exported as public Type
 */
export type WalletDropdownLinkReact = {
    children: string;
    className?: string;
    href: string;
    icon?: 'wallet' & ReactNode;
    rel?: string;
    target?: string;
};
//# sourceMappingURL=types.d.ts.map