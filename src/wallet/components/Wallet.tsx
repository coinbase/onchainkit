'use client';

import { Avatar, Name } from '@/identity';
import { Draggable } from '@/internal/components/Draggable/Draggable';
import { useIsMounted } from '@/internal/hooks/useIsMounted';
import { useOutsideClick } from '@/internal/hooks/useOutsideClick';
import { useTheme } from '@/internal/hooks/useTheme';
import { findComponent } from '@/internal/utils/findComponent';
import { cn } from '@/styles/theme';
import {
  Children,
  type ReactNode,
  isValidElement,
  useMemo,
  useRef,
} from 'react';
import type { WalletReact } from '../types';
import { getWalletDraggableProps } from '../utils/getWalletDraggableProps';
import { ConnectWallet } from './ConnectWallet';
import { WalletAdvanced } from './WalletAdvanced';
import { WalletDropdown } from './WalletDropdown';
import { WalletProvider, useWalletContext } from './WalletProvider';

const defaultWalletChildren = (
  <>
    <ConnectWallet>
      <Avatar className="h-6 w-6" key="avatar" />
      <Name key="name" />
    </ConnectWallet>
    <WalletDropdown />
  </>
);

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
    breakpoint,
  } = useWalletContext();
  const walletContainerRef = useRef<HTMLDivElement>(null);

  useOutsideClick(walletContainerRef, handleClose);

  const { dropdown, advanced } = useMemo(() => {
    const childrenArray = Children.toArray(children);
    return {
      dropdown: childrenArray.find(findComponent(WalletDropdown)),
      advanced: childrenArray.find(findComponent(WalletAdvanced)),
    };
  }, [children]);

  // cannot use advanced and dropdown,
  // default to dropdown
  const childrenToRender = useMemo(() => {
    return Children.map(children, (child: ReactNode) => {
      if (isValidElement(child) && child.type === WalletAdvanced && dropdown) {
        return null;
      }
      return child;
    });
  }, [dropdown, children]);

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
          <div ref={connectRef}>
            {childrenToRender || defaultWalletChildren}
          </div>
        </Draggable>
      </div>
    );
  }

  return (
    <div
      ref={walletContainerRef}
      className={cn('relative w-fit shrink-0', className)}
    >
      <div ref={connectRef}>{childrenToRender || defaultWalletChildren}</div>
    </div>
  );
}
