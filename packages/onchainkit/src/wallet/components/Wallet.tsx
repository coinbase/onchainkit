'use client';
import { Draggable } from '@/internal/components/Draggable/Draggable';
import { useIsMounted } from '@/internal/hooks/useIsMounted';
import { cn } from '@/styles/theme';
import { useRef } from 'react';
import { getWalletDraggableProps } from '../utils/getWalletDraggableProps';
import { ConnectWallet } from './ConnectWallet';
import { WalletDropdown } from './WalletDropdown';
import { WalletProvider, useWalletContext } from './WalletProvider';
import { Button } from '@/ui/Button';

export type WalletProps = {
  children?: React.ReactNode;
  /** Whether to sponsor transactions for Send feature of advanced wallet implementation */
  isSponsored?: boolean;
  className?: string;
  unmountedContent?: React.ReactNode;
} & (
  | { draggable?: true; draggableStartingPosition?: { x: number; y: number } }
  | { draggable?: false; draggableStartingPosition?: never }
);

function WalletContent({
  children,
  className,
  draggable,
  draggableStartingPosition,
}: WalletProps) {
  const { isSubComponentOpen, isConnectModalOpen, connectRef, breakpoint } =
    useWalletContext();
  const walletContainerRef = useRef<HTMLDivElement>(null);

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

export function Wallet({
  children = (
    <>
      <ConnectWallet />
      <WalletDropdown />
    </>
  ),
  className,
  draggable,
  draggableStartingPosition,
  isSponsored,
  unmountedContent,
}: WalletProps) {
  const isMounted = useIsMounted();

  // prevents SSR hydration issue
  if (!isMounted) {
    return unmountedContent ?? <Button disabled>Connect Wallet</Button>;
  }

  return (
    <WalletProvider isSponsored={isSponsored}>
      <WalletContent
        className={className}
        {...getWalletDraggableProps({ draggable, draggableStartingPosition })}
      >
        {children}
      </WalletContent>
    </WalletProvider>
  );
}
