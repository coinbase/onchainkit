'use client';

import { Draggable } from '@/internal/components/Draggable/Draggable';
import { useIsMounted } from '@/internal/hooks/useIsMounted';
import { useOutsideClick } from '@/internal/hooks/useOutsideClick';
import { useTheme } from '@/internal/hooks/useTheme';
import { findComponent } from '@/internal/utils/findComponent';
import { cn } from '@/styles/theme';
import { Children, useMemo, useRef } from 'react';
import type { WalletReact, WalletSubComponentReact } from '../types';
import { getWalletDraggableProps } from '../utils/getWalletDraggableProps';
import { ConnectWallet } from './ConnectWallet';
import { WalletAdvanced } from './WalletAdvanced';
import { WalletDropdown } from './WalletDropdown';
import { WalletProvider, useWalletContext } from './WalletProvider';

export const Wallet = ({
  children,
  className,
  draggable,
  draggableStartingPosition,
}: WalletReact) => {
  const componentTheme = useTheme();
  const isMounted = useIsMounted();

  // prevents SSR hydration issue
  if (!isMounted) {
    return null;
  }

  return (
    <WalletProvider>
      <WalletContent
        className={cn(componentTheme, className)}
        {...getWalletDraggableProps({ draggable, draggableStartingPosition })}
      >
        {children}
      </WalletContent>
    </WalletProvider>
  );
};

function WalletContent({
  children,
  className,
  draggable,
  draggableStartingPosition,
}: WalletReact) {
  const {
    isSubComponentOpen,
    isConnectModalOpen,
    handleClose,
    connectRef,
    showSubComponentAbove,
    alignSubComponentRight,
    breakpoint,
  } = useWalletContext();
  const walletContainerRef = useRef<HTMLDivElement>(null);

  useOutsideClick(walletContainerRef, handleClose);

  const { connect, dropdown, advanced } = useMemo(() => {
    const childrenArray = Children.toArray(children);
    return {
      connect: childrenArray.find(findComponent(ConnectWallet)),
      dropdown: childrenArray.find(findComponent(WalletDropdown)),
      advanced: childrenArray.find(findComponent(WalletAdvanced)),
    };
  }, [children]);

  if (dropdown && advanced) {
    console.error(
      'Defaulted to WalletDropdown. Wallet cannot have both WalletDropdown and WalletAdvanced as children.',
    );
  }

  // dragging should be disabled when the connect wallet modal is open
  // or when the subcomponent is open on mobile (because then we use bottom sheet)
  const disableDraggable =
    isConnectModalOpen || (breakpoint === 'sm' && isSubComponentOpen);

  if (draggable) {
    return (
      <div
        ref={walletContainerRef}
        className={cn('relative w-fit shrink-0', className)}
      >
        <Draggable
          startingPosition={draggableStartingPosition}
          disabled={disableDraggable}
        >
          <WalletSubComponent
            connect={connect}
            connectRef={connectRef}
            dropdown={dropdown}
            advanced={advanced}
            isSubComponentOpen={isSubComponentOpen}
            alignSubComponentRight={alignSubComponentRight}
            showSubComponentAbove={showSubComponentAbove}
          />
        </Draggable>
      </div>
    );
  }

  return (
    <div
      ref={walletContainerRef}
      className={cn('relative w-fit shrink-0', className)}
    >
      <WalletSubComponent
        connect={connect}
        connectRef={connectRef}
        dropdown={dropdown}
        advanced={advanced}
        isSubComponentOpen={isSubComponentOpen}
        alignSubComponentRight={alignSubComponentRight}
        showSubComponentAbove={showSubComponentAbove}
      />
    </div>
  );
}

function WalletSubComponent({
  connect,
  connectRef,
  dropdown,
  advanced,
  isSubComponentOpen,
  alignSubComponentRight,
  showSubComponentAbove,
}: WalletSubComponentReact) {
  if (dropdown) {
    return (
      <>
        {connect}
        {isSubComponentOpen && dropdown}
      </>
    );
  }

  return (
    <>
      <div ref={connectRef}>{connect}</div>
      {isSubComponentOpen && (
        <div
          data-testid="ockWalletAdvancedContainer"
          className={cn(
            'absolute',
            showSubComponentAbove ? 'bottom-full' : 'top-full',
            alignSubComponentRight ? 'right-0' : 'left-0',
          )}
        >
          {advanced}
        </div>
      )}
    </>
  );
}
