import { useIsMounted } from '@/core-react/internal/hooks/useIsMounted';
import { useTheme } from '@/core-react/internal/hooks/useTheme';
import { findComponent } from '@/core-react/internal/utils/findComponent';
import { Draggable } from '@/internal/components/Draggable';
import { cn } from '@/styles/theme';
import { useOutsideClick } from '@/ui-react/internal/hooks/useOutsideClick';
import { Children, useMemo, useRef } from 'react';
import type { WalletReact } from '../types';
import { WALLET_DRAGGABLE_DEFAULT_STARTING_POSITION } from '../constants';
import { ConnectWallet } from './ConnectWallet';
import { WalletDropdown } from './WalletDropdown';
import { WalletAdvanced } from './WalletAdvanced';
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
        {...(draggable
          ? {
              draggable,
              draggableStartingPosition:
                draggableStartingPosition ??
                WALLET_DRAGGABLE_DEFAULT_STARTING_POSITION,
            }
          : { draggable })}
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
  } = useWalletContext();
  const walletContainerRef = useRef<HTMLDivElement>(null);

  useOutsideClick(walletContainerRef, handleClose);

  const { connect, dropdown, island } = useMemo(() => {
    const childrenArray = Children.toArray(children);
    return {
      connect: childrenArray.find(findComponent(ConnectWallet)),
      dropdown: childrenArray.find(findComponent(WalletDropdown)),
      island: childrenArray.find(findComponent(WalletAdvanced)),
    };
  }, [children]);

  if (dropdown && island) {
    console.error(
      'Defaulted to WalletDropdown. Wallet cannot have both WalletDropdown and WalletIsland as children.',
    );
  }

  if (draggable) {
    return (
      <div
        ref={walletContainerRef}
        className={cn('relative w-fit shrink-0', className)}
      >
        <Draggable
          startingPosition={draggableStartingPosition}
          draggingDisabled={isConnectModalOpen}
        >
          <WalletSubComponent
            connect={connect}
            connectRef={connectRef}
            dropdown={dropdown}
            island={island}
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
        island={island}
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
  island,
  isSubComponentOpen,
  alignSubComponentRight,
  showSubComponentAbove,
}: {
  connect: React.ReactNode;
  connectRef: React.RefObject<HTMLDivElement>;
  dropdown: React.ReactNode;
  island: React.ReactNode;
  isSubComponentOpen: boolean;
  alignSubComponentRight: boolean;
  showSubComponentAbove: boolean;
}) {
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
          data-testid="ockWalletIslandContainer"
          className={cn(
            'absolute',
            showSubComponentAbove ? 'bottom-full' : 'top-full',
            alignSubComponentRight ? 'right-0' : 'left-0',
          )}
        >
          {island}
        </div>
      )}
    </>
  );
}
