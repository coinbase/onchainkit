'use client';
import { Draggable } from '@/internal/components/Draggable/Draggable';
import { useIsMounted } from '@/internal/hooks/useIsMounted';
import { useOutsideClick } from '@/internal/hooks/useOutsideClick';
import { useTheme } from '@/internal/hooks/useTheme';
import { cn } from '@/styles/theme';
import { useRef } from 'react';
import type { WalletProps } from '../types';
import { getWalletDraggableProps } from '../utils/getWalletDraggableProps';
import { ConnectWallet } from './ConnectWallet';
import { WalletDropdown } from './WalletDropdown';
import { WalletProvider, useWalletContext } from './WalletProvider';

function WalletContent({
  children,
  className,
  draggable,
  draggableStartingPosition,
}: WalletProps) {
  const {
    isSubComponentOpen,
    isConnectModalOpen,
    handleClose,
    connectRef,
    breakpoint,
  } = useWalletContext();
  const walletContainerRef = useRef<HTMLDivElement>(null);

  useOutsideClick(walletContainerRef, handleClose);

  if (draggable) {
    return (
      <div
        ref={walletContainerRef}
        className={cn('relative w-fit shrink-0', className)}
      >
        <Draggable
          startingPosition={draggableStartingPosition}
          disabled={
            isConnectModalOpen || (breakpoint === 'sm' && isSubComponentOpen)
          }
        >
          <div ref={connectRef}>{children}</div>
        </Draggable>
      </div>
    );
  }

  return (
    <div
      ref={walletContainerRef}
      className={cn('relative w-fit shrink-0', className)}
    >
      <div ref={connectRef}>{children}</div>
    </div>
  );
}

const defaultWalletChildren = (
  <>
    <ConnectWallet />
    <WalletDropdown />
  </>
);

export function Wallet({
  children = defaultWalletChildren,
  className,
  draggable,
  draggableStartingPosition,
  isSponsored,
}: WalletProps) {
  const componentTheme = useTheme();
  const isMounted = useIsMounted();

  // prevents SSR hydration issue
  if (!isMounted) {
    return null;
  }

  return (
    <WalletProvider isSponsored={isSponsored}>
      <WalletContent
        className={cn(componentTheme, className)}
        {...getWalletDraggableProps({ draggable, draggableStartingPosition })}
      >
        {children}
      </WalletContent>
    </WalletProvider>
  );
}
