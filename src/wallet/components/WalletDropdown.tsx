'use client';

import { Identity } from '@/identity/components/Identity';
import { zIndex } from '@/styles/constants';
import { cn, color, pressable } from '@/styles/theme';
import { Children, cloneElement, isValidElement, useMemo } from 'react';
import type { WalletDropdownReact } from '../types';
import { WalletBottomSheet } from './WalletBottomSheet';
import { useWalletContext } from './WalletProvider';

export function WalletDropdown({ children, className }: WalletDropdownReact) {
  const {
    address,
    breakpoint,
    isSubComponentClosing,
    setIsSubComponentOpen,
    setIsSubComponentClosing,
  } = useWalletContext();

  const childrenArray = useMemo(() => {
    return Children.toArray(children).map((child) => {
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
