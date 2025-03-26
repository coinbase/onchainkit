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
import type { WalletAdvancedFeature, WalletContextType } from '../types';
import { calculateSubComponentPosition } from '../utils/getWalletSubComponentPosition';
import { RequestContext } from '@/core/network/constants';
import { usePortfolio } from '../hooks/usePortfolio';

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

  const [activeFeature, setActiveFeature] =
    useState<WalletAdvancedFeature | null>(null);
  const [isActiveFeatureClosing, setIsActiveFeatureClosing] = useState(false);
  const {
    data: portfolioData,
    refetch: refetchPortfolioData,
    isFetching: isFetchingPortfolioData,
    dataUpdatedAt: portfolioDataUpdatedAt,
  } = usePortfolio({ address }, RequestContext.Wallet);

  const portfolioFiatValue = portfolioData?.portfolioBalanceInUsd;
  const tokenBalances = portfolioData?.tokenBalances;

  const animations = getAnimations(
    isSubComponentClosing,
    showSubComponentAbove,
  );

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
    activeFeature,
    setActiveFeature,
    isActiveFeatureClosing,
    setIsActiveFeatureClosing,
    tokenBalances,
    portfolioFiatValue,
    isFetchingPortfolioData,
    portfolioDataUpdatedAt,
    refetchPortfolioData,
    animations,
  });

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWalletContext() {
  return useContext(WalletContext);
}

function getAnimations(
  isSubComponentClosing: boolean,
  showSubComponentAbove: boolean,
) {
  if (isSubComponentClosing) {
    return {
      container: showSubComponentAbove
        ? 'fade-out slide-out-to-bottom-1.5 animate-out fill-mode-forwards ease-in-out'
        : 'fade-out slide-out-to-top-1.5 animate-out fill-mode-forwards ease-in-out',
      content: '',
    };
  }

  return {
    container: showSubComponentAbove
      ? 'fade-in slide-in-from-bottom-1.5 animate-in duration-300 ease-out'
      : 'fade-in slide-in-from-top-1.5 animate-in duration-300 ease-out',
    content: showSubComponentAbove
      ? 'fade-in slide-in-from-bottom-2.5 animate-in fill-mode-forwards duration-300 ease-out'
      : 'fade-in slide-in-from-top-2.5 animate-in fill-mode-forwards duration-300 ease-out',
  };
}
