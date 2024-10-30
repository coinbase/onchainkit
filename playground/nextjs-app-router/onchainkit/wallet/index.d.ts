import * as react_jsx_runtime from 'react/jsx-runtime';
import { UserOperation } from 'permissionless';
import { Dispatch, SetStateAction, ReactNode } from 'react';
import { PublicClient, Address, Chain } from 'viem';

/**
 * Note: exported as public Type
 */
type ConnectWalletReact = {
    children?: React.ReactNode;
    className?: string;
    /** @deprecated Prefer `ConnectWalletText component` */
    text?: string;
    withWalletAggregator?: boolean;
};
/**
 * Note: exported as public Type
 */
type ConnectWalletTextReact = {
    children: React.ReactNode;
    className?: string;
};
/**
 * Note: exported as public Type
 */
type IsValidAAEntrypointOptions = {
    entrypoint: string;
};
/**
 * Note: exported as public Type
 */
type IsWalletACoinbaseSmartWalletOptions = {
    client: PublicClient;
    userOp: UserOperation<'v0.6'>;
};
/**
 * Note: exported as public Type
 */
type IsWalletACoinbaseSmartWalletResponse = {
    isCoinbaseSmartWallet: true;
} | {
    isCoinbaseSmartWallet: false;
    error: string;
    code: string;
};
/**
 * Note: exported as public Type
 */
type WalletContextType = {
    address?: Address | null;
    chain?: Chain;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
};
/**
 * Note: exported as public Type
 */
type WalletReact = {
    children: React.ReactNode;
    className?: string;
};
/**
 * Note: exported as public Type
 */
type WalletDropdownBasenameReact = {
    className?: string;
};
/**
 * Note: exported as public Type
 */
type WalletDropdownReact = {
    children: React.ReactNode;
    className?: string;
};
/**
 * Note: exported as public Type
 */
type WalletDropdownDisconnectReact = {
    className?: string;
    text?: string;
};
/**
 * Note: exported as public Type
 */
type WalletDropdownFundLinkReact = {
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
type WalletDropdownLinkReact = {
    children: string;
    className?: string;
    href: string;
    icon?: 'wallet' & ReactNode;
    rel?: string;
    target?: string;
};

declare function ConnectWallet({ children, className, text, withWalletAggregator, }: ConnectWalletReact): react_jsx_runtime.JSX.Element;

declare function ConnectWalletText({ children, className, }: ConnectWalletTextReact): react_jsx_runtime.JSX.Element;

declare const Wallet: ({ children, className }: WalletReact) => react_jsx_runtime.JSX.Element | null;

declare function WalletDefault(): react_jsx_runtime.JSX.Element;

declare function WalletDropdown({ children, className }: WalletDropdownReact): react_jsx_runtime.JSX.Element | null;

declare function WalletDropdownBasename({ className, }: WalletDropdownBasenameReact): react_jsx_runtime.JSX.Element | null;

declare function WalletDropdownDisconnect({ className, text, }: WalletDropdownDisconnectReact): react_jsx_runtime.JSX.Element;

declare function WalletDropdownFundLink({ className, fundingUrl, icon, openIn, popupSize, rel, target, text, }: WalletDropdownFundLinkReact): react_jsx_runtime.JSX.Element;

declare function WalletDropdownLink({ children, className, icon, href, rel, target, }: WalletDropdownLinkReact): react_jsx_runtime.JSX.Element;

/**
 * Verify the Account-Abstraction entrypoint before sponsoring a transaction.
 */
declare function isValidAAEntrypoint({ entrypoint, }: IsValidAAEntrypointOptions): boolean;

/**
 * Validates a User Operation by checking if the sender address
 * is a proxy with the expected bytecode.
 */
declare function isWalletACoinbaseSmartWallet({ client, userOp, }: IsWalletACoinbaseSmartWalletOptions): Promise<IsWalletACoinbaseSmartWalletResponse>;

export { ConnectWallet, type ConnectWalletReact, ConnectWalletText, type ConnectWalletTextReact, type IsValidAAEntrypointOptions, type IsWalletACoinbaseSmartWalletOptions, type IsWalletACoinbaseSmartWalletResponse, Wallet, type WalletContextType, WalletDefault, WalletDropdown, WalletDropdownBasename, type WalletDropdownBasenameReact, WalletDropdownDisconnect, type WalletDropdownDisconnectReact, WalletDropdownFundLink, type WalletDropdownFundLinkReact, WalletDropdownLink, type WalletDropdownLinkReact, type WalletDropdownReact, type WalletReact, isValidAAEntrypoint, isWalletACoinbaseSmartWallet };
