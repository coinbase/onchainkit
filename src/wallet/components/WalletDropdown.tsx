'use client';

import { Address, Avatar, EthBalance, Identity, Name } from '@/identity';
import { zIndex } from '@/styles/constants';
import { cn, color, pressable } from '@/styles/theme';
import type { WalletDropdownReact } from '../types';
import { WalletBottomSheet } from './WalletBottomSheet';
import { WalletDropdownDisconnect } from './WalletDropdownDisconnect';
import { WalletDropdownLink } from './WalletDropdownLink';
import { useWalletContext } from './WalletProvider';

const defaultWalletDropdownChildren = (
  <>
    <Identity className="px-4 pt-3 pb-2" key="wallet-dd-identity">
      <Avatar />
      <Name />
      <Address className={color.foregroundMuted} />
      <EthBalance />
    </Identity>
    <WalletDropdownLink
      icon="wallet"
      key="wallet-dd-link"
      href="https://keys.coinbase.com"
      target="_blank"
    >
      Wallet
    </WalletDropdownLink>
    <WalletDropdownDisconnect key="wallet-dd-disconnect" />
  </>
);

export function WalletDropdown({ children, className }: WalletDropdownReact) {
  const {
    address,
    breakpoint,
    isSubComponentClosing,
    setIsSubComponentOpen,
    setIsSubComponentClosing,
    isSubComponentOpen,
  } = useWalletContext();

  if (!address) {
    return null;
  }

  if (!breakpoint) {
    return null;
  }

  if (!isSubComponentOpen) {
    return null;
  }

  if (breakpoint === 'sm') {
    return (
      <WalletBottomSheet className={className}>{children}</WalletBottomSheet>
    );
  }

  return (
    <div
      className={cn(
        pressable.default,
        color.foreground,
        zIndex.dropdown,
        'absolute right-0 mt-1.5 flex w-max min-w-[300px] cursor-default flex-col overflow-hidden rounded-xl',
        isSubComponentClosing
          ? 'fade-out slide-out-to-top-1.5 animate-out fill-mode-forwards ease-in-out'
          : 'fade-in slide-in-from-top-1.5 animate-in duration-300 ease-out',
        className,
      )}
      onAnimationEnd={() => {
        if (isSubComponentClosing) {
          setIsSubComponentOpen(false);
          setIsSubComponentClosing(false);
        }
      }}
      data-testid="ockWalletDropdown"
    >
      {children || defaultWalletDropdownChildren}
    </div>
  );
}
