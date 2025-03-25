'use client';

import { useBreakpoints } from '@/internal/hooks/useBreakpoints';
import { useValue } from '@/internal/hooks/useValue';
import { useOnchainKit } from '@/useOnchainKit';
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
import type { WalletContextType } from '../types';
import { calculateSubComponentPosition } from '../utils/getWalletSubComponentPosition';

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
  const connectRef = useRef<HTMLDivElement>(null);
  const { address } = useAccount();
  const breakpoint = useBreakpoints();

  const handleClose = useCallback(() => {
    if (!isSubComponentOpen) {
      return;
    }
    setIsSubComponentClosing(true);
  }, [isSubComponentOpen]);

  useEffect(() => {
    if (isSubComponentOpen && connectRef?.current) {
      const connectRect = connectRef.current.getBoundingClientRect();
      const position = calculateSubComponentPosition(connectRect);
      setShowSubComponentAbove(position.showAbove);
      setAlignSubComponentRight(position.alignRight);
    }
  }, [isSubComponentOpen]);

  const value = useValue<WalletContextType>({
    address,
    chain,
    breakpoint,
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
