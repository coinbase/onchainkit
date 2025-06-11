'use client';

import { useBreakpoints } from '@/internal/hooks/useBreakpoints';
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
import type { WalletAdvancedFeature, WalletContextType } from '../types';
import { getAnimations } from '../utils/getAnimations';
import { calculateSubComponentPosition } from '../utils/getWalletSubComponentPosition';

export const WalletContext = createContext<WalletContextType | null>(null);

export type WalletProviderReact = {
  children: ReactNode;
  /** Whether to sponsor transactions for Send feature of advanced wallet implementation */
  isSponsored?: boolean;
};

export function WalletProvider({ children, isSponsored }: WalletProviderReact) {
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isSubComponentOpen, setIsSubComponentOpen] = useState(false);
  const [isSubComponentClosing, setIsSubComponentClosing] = useState(false);
  const [showSubComponentAbove, setShowSubComponentAbove] = useState(false);
  const [alignSubComponentRight, setAlignSubComponentRight] = useState(false);

  const connectRef = useRef<HTMLDivElement | null>(null);
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
      __hasContext: true,
    };
  }, [
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
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }

  return context;
}
