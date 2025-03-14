'use client';

import { Identity } from '@/identity';
import { zIndex } from '@/styles/constants';
import { cn, color, pressable } from '@/styles/theme';
import { Children, cloneElement, isValidElement, useMemo } from 'react';
import type { WalletDropdownReact } from '../types';
import { WalletBottomSheet } from './WalletBottomSheet';
import { useWalletContext } from './WalletProvider';
import { WalletDropdownDisconnect } from './WalletDropdownDisconnect';
import { WalletDropdownLink } from './WalletDropdownLink';

const defaultWalletDropdownChildren = [
  <Identity className="px-4 pt-3 pb-2" key="wallet-dd-identity" />,
  <WalletDropdownLink
    icon="wallet"
    key="wallet-dd-link"
    href="https://keys.coinbase.com"
    target="_blank"
  >
    Wallet
  </WalletDropdownLink>,
  <WalletDropdownDisconnect key="wallet-dd-disconnect" />,
];

export function WalletDropdown({ children, className }: WalletDropdownReact) {
  const {
    address,
    breakpoint,
    isSubComponentClosing,
    setIsSubComponentOpen,
    setIsSubComponentClosing,
  } = useWalletContext();

  const childrenArray = useMemo(() => {
    // default children implementation
    const childrenToClone = children
      ? Children.toArray(children)
      : defaultWalletDropdownChildren;

    return childrenToClone.map((child) => {
      if (isValidElement(child) && child.type === Identity) {
        // @ts-ignore
        return cloneElement(child, { address });
      }
      return child;
    });
  }, [children, address]);

  if (!address) {
    return null;
  }

  if (!breakpoint) {
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
      {childrenArray}
    </div>
  );
}
