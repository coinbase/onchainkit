'use client';

import { useBreakpoints } from '@/internal/hooks/useBreakpoints';
import { useOnchainKit } from '@/useOnchainKit';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { useAccount } from 'wagmi';
import type { WalletAdvancedFeature, WalletContextType } from '../types';
import { getAnimations } from '../utils/getAnimations';
import { calculateSubComponentPosition } from '../utils/getWalletSubComponentPosition';

const emptyContext = {} as WalletContextType;

const WalletContext = createContext<WalletContextType>(emptyContext);

export type WalletProviderReact = {
  children: ReactNode;
  /** Whether to sponsor transactions for Send feature of advanced wallet implementation */
  isSponsored?: boolean;
};

export function WalletProvider({ children, isSponsored }: WalletProviderReact) {
  const { chain } = useOnchainKit();
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isSubComponentOpen, setIsSubComponentOpen] = useState(false);
  const [isSubComponentClosing, setIsSubComponentClosing] = useState(false);
  const [showSubComponentAbove, setShowSubComponentAbove] = useState(false);
  const [alignSubComponentRight, setAlignSubComponentRight] = useState(false);

  const connectRef = useRef<HTMLDivElement>(null);
  const { address } = useAccount();
  const breakpoint = useBreakpoints();

  const [activeFeature, setActiveFeature] =
    useState<WalletAdvancedFeature | null>(null);
  const [isActiveFeatureClosing, setIsActiveFeatureClosing] = useState(false);

  const animations = useMemo(() => {
    return getAnimations(isSubComponentClosing, showSubComponentAbove);
  }, [isSubComponentClosing, showSubComponentAbove]);

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

  const value = useMemo(() => {
    return {
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
      activeFeature,
      setActiveFeature,
      isActiveFeatureClosing,
      setIsActiveFeatureClosing,
      animations,
      isSponsored,
    };
  }, [
    address,
    chain,
    breakpoint,
    isConnectModalOpen,
    isSubComponentOpen,
    isSubComponentClosing,
    handleClose,
    showSubComponentAbove,
    alignSubComponentRight,
    activeFeature,
    isActiveFeatureClosing,
    animations,
    isSponsored,
  ]);

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWalletContext() {
  return useContext(WalletContext);
}
