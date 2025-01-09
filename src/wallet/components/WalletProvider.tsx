import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useAccount } from 'wagmi';
import { useValue } from '../../core-react/internal/hooks/useValue';
import { useOnchainKit } from '../../core-react/useOnchainKit';
import type { WalletContextType } from '../types';
import {
  WALLET_ISLAND_MAX_HEIGHT,
  WALLET_ISLAND_MAX_WIDTH,
} from '../constants';

const emptyContext = {} as WalletContextType;

const WalletContext = createContext<WalletContextType>(emptyContext);

export type WalletProviderReact = {
  children: ReactNode;
};

export function WalletProvider({ children }: WalletProviderReact) {
  const { chain } = useOnchainKit();
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showSubComponentAbove, setShowSubComponentAbove] = useState(false);
  const [alignSubComponentRight, setAlignSubComponentRight] = useState(false);
  const { address } = useAccount();
  const connectRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    if (!isOpen) {
      return;
    }
    setIsClosing(true);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && connectRef?.current) {
      const connectRect = connectRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      const spaceAvailableBelow = viewportHeight - connectRect.bottom;
      const spaceAvailableRight = viewportWidth - connectRect.left;

      setShowSubComponentAbove(spaceAvailableBelow < WALLET_ISLAND_MAX_HEIGHT);
      setAlignSubComponentRight(spaceAvailableRight < WALLET_ISLAND_MAX_WIDTH);
    }
  }, [isOpen]);

  const value = useValue({
    address,
    chain,
    isOpen,
    setIsOpen,
    isClosing,
    setIsClosing,
    handleClose,
    connectRef,
    showSubComponentAbove,
    alignSubComponentRight,
  });

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWalletContext() {
  return useContext(WalletContext);
}
