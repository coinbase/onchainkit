import { useValue } from '@/core-react/internal/hooks/useValue';
import { usePortfolioTokenBalances } from '@/core-react/wallet/hooks/usePortfolioTokenBalances';
import { type ReactNode, createContext, useContext, useState } from 'react';
import type { WalletIslandContextType } from '../types';
import { useWalletContext } from './WalletProvider';

type WalletIslandProviderReact = {
  children: ReactNode;
};

const emptyContext = {} as WalletIslandContextType;

const WalletIslandContext =
  createContext<WalletIslandContextType>(emptyContext);

export function useWalletIslandContext() {
  const walletIslandContext = useContext(WalletIslandContext);
  if (walletIslandContext === emptyContext) {
    throw new Error(
      'useWalletIslandContext must be used within a WalletIslandProvider',
    );
  }
  return walletIslandContext;
}

export function WalletIslandProvider({ children }: WalletIslandProviderReact) {
  const { address, isClosing, showSubComponentAbove } = useWalletContext();
  const [showSwap, setShowSwap] = useState(false);
  const [isSwapClosing, setIsSwapClosing] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [isQrClosing, setIsQrClosing] = useState(false);
  const {
    data: portfolioData,
    refetch: refetchPortfolioData,
    isFetching: isFetchingPortfolioData,
    dataUpdatedAt: portfolioDataUpdatedAt,
  } = usePortfolioTokenBalances({ address });

  const portfolioFiatValue = portfolioData?.portfolioBalanceInUsd;
  const tokenBalances = portfolioData?.tokenBalances;

  const animations = getAnimations(isClosing, showSubComponentAbove);

  const value = useValue({
    showSwap,
    setShowSwap,
    isSwapClosing,
    setIsSwapClosing,
    showQr,
    setShowQr,
    isQrClosing,
    setIsQrClosing,
    tokenBalances,
    portfolioFiatValue,
    isFetchingPortfolioData,
    portfolioDataUpdatedAt,
    refetchPortfolioData,
    animations,
  });

  return (
    <WalletIslandContext.Provider value={value}>
      {children}
    </WalletIslandContext.Provider>
  );
}

function getAnimations(isClosing: boolean, showSubComponentAbove: boolean) {
  if (isClosing) {
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
