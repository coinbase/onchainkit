'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { useAccount } from 'wagmi';
import { useValue } from '../../core-react/internal/hooks/useValue';
import { useOnchainKit } from '../../core-react/useOnchainKit';
import {
  WALLET_ADVANCED_MAX_HEIGHT,
  WALLET_ADVANCED_MAX_WIDTH,
} from '../constants';
import type { WalletContextType } from '../types';

const emptyContext = {} as WalletContextType;

const WalletContext = createContext<WalletContextType>(emptyContext);

export type WalletProviderReact = {
  children: ReactNode;
};

export function WalletProvider({ children }: WalletProviderReact) {
  const { chain } = useOnchainKit();
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isSubComponentOpen, setIsSubComponentOpen] = useState(false);
  const [isSubComponentClosing, setIsSubComponentClosing] = useState(false);
  const [showSubComponentAbove, setShowSubComponentAbove] = useState(false);
  const [alignSubComponentRight, setAlignSubComponentRight] = useState(false);
  const { address } = useAccount();
  const connectRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    if (!isSubComponentOpen) {
      return;
    }
    setIsSubComponentClosing(true);
  }, [isSubComponentOpen]);

  useEffect(() => {
    if (isSubComponentOpen && connectRef?.current) {
      if (typeof window === 'undefined') {
        return;
      }

      const connectRect = connectRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      const spaceAvailableBelow = viewportHeight - connectRect.bottom;
      const spaceAvailableRight = viewportWidth - connectRect.left;

      setShowSubComponentAbove(
        spaceAvailableBelow < WALLET_ADVANCED_MAX_HEIGHT,
      );
      setAlignSubComponentRight(
        spaceAvailableRight < WALLET_ADVANCED_MAX_WIDTH,
      );
    }
  }, [isSubComponentOpen]);

  const value = useValue({
    address,
    chain,
    isConnectModalOpen,
    setIsConnectModalOpen,
    isSubComponentOpen,
    setIsSubComponentOpen,
    isSubComponentClosing,
    setIsSubComponentClosing,
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
