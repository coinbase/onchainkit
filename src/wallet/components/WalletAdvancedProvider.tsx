import { RequestContext } from '@/core/network/constants';
import { useValue } from '@/internal/hooks/useValue';
import { usePortfolio } from '@/wallet/hooks/usePortfolio';
import { type ReactNode, createContext, useContext, useState } from 'react';
import type { WalletAdvancedContextType } from '../types';
import { useWalletContext } from './WalletProvider';

type WalletAdvancedProviderReact = {
  children: ReactNode;
};

const emptyContext = {} as WalletAdvancedContextType;

const WalletAdvancedContext =
  createContext<WalletAdvancedContextType>(emptyContext);

export function useWalletAdvancedContext() {
  const walletAdvancedContext = useContext(WalletAdvancedContext);
  if (walletAdvancedContext === emptyContext) {
    throw new Error(
      'useWalletAdvancedContext must be used within a WalletAdvancedProvider',
    );
  }
  return walletAdvancedContext;
}

export function WalletAdvancedProvider({
  children,
}: WalletAdvancedProviderReact) {
  const { address, isSubComponentClosing, showSubComponentAbove } =
    useWalletContext();
  const [showSwap, setShowSwap] = useState(false);
  const [isSwapClosing, setIsSwapClosing] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [isQrClosing, setIsQrClosing] = useState(false);
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
    <WalletAdvancedContext.Provider value={value}>
      {children}
    </WalletAdvancedContext.Provider>
  );
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
