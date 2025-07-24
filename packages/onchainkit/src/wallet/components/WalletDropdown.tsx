'use client';

import { Address, Avatar, EthBalance, Identity, Name } from '@/identity';
import { cn } from '@/styles/theme';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  FloatingPortal,
} from '@floating-ui/react';
import { useEffect } from 'react';
import type {
  WalletAdvancedQrReceiveProps,
  WalletAdvancedSwapProps,
} from '../types';
import { WalletDropdownContent } from './WalletDropdownContent';
import { WalletDropdownDisconnect } from './WalletDropdownDisconnect';
import { WalletDropdownLink } from './WalletDropdownLink';
import { useWalletContext } from './WalletProvider';
import { useAccount } from 'wagmi';
import { Token } from '@/token';

export type WalletDropdownProps = {
  children?: React.ReactNode;
  /** Optional className override for top div element */
  className?: string;
  classNames?: {
    container?: string;
    qr?: WalletAdvancedQrReceiveProps['classNames'];
    swap?: WalletAdvancedSwapProps['classNames'];
  };
  swappableTokens?: Token[];
};

const defaultWalletDropdownChildren = (
  <>
    <Identity className="px-4 pt-3 pb-2" key="wallet-dd-identity">
      <Avatar />
      <Name />
      <Address className={'text-ock-foreground-muted'} />
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

export function WalletDropdown({
  children,
  className,
  classNames,
  swappableTokens,
}: WalletDropdownProps) {
  const {
    breakpoint,
    isSubComponentOpen,
    showSubComponentAbove,
    alignSubComponentRight,
    connectRef,
  } = useWalletContext();
  const { address } = useAccount();

  const { refs, floatingStyles } = useFloating({
    open: isSubComponentOpen,
    placement: showSubComponentAbove
      ? alignSubComponentRight
        ? 'top-end'
        : 'top-start'
      : alignSubComponentRight
        ? 'bottom-end'
        : 'bottom-start',
    middleware: [
      offset(6),
      flip({
        fallbackPlacements: [
          'top-start',
          'top-end',
          'bottom-start',
          'bottom-end',
        ],
      }),
      shift({ padding: 8 }),
    ],
    whileElementsMounted: autoUpdate,
  });

  // Sync the floating-ui reference with the connectRef from WalletProvider
  useEffect(() => {
    if (connectRef?.current) {
      refs.setReference(connectRef.current);
    }
  }, [connectRef, refs]);

  if (!address || !breakpoint || !isSubComponentOpen) {
    return null;
  }

  return (
    <FloatingPortal>
      <div
        ref={refs.setFloating}
        style={floatingStyles}
        data-testid="ockWalletDropdown"
        className={cn('z-50', className)}
      >
        <WalletDropdownContent
          classNames={classNames}
          swappableTokens={swappableTokens}
        >
          {children || defaultWalletDropdownChildren}
        </WalletDropdownContent>
      </div>
    </FloatingPortal>
  );
}
