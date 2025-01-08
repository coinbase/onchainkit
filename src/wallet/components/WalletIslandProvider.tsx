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
  const { address } = useWalletContext();
  const [showSwap, setShowSwap] = useState(false);
  const [isSwapClosing, setIsSwapClosing] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [isQrClosing, setIsQrClosing] = useState(false);
  const {
    data: portfolioData,
    refetch: refetchPortfolioData,
    isFetching: isFetchingPortfolioData,
    dataUpdatedAt: portfolioDataUpdatedAt,
  } = usePortfolioTokenBalances({ address: address ?? '0x000' });

  const portfolioFiatValue = portfolioData?.portfolioBalanceUsd;
  const tokenBalances = portfolioData?.tokenBalances;

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
  });

  return (
    <WalletIslandContext.Provider value={value}>
      {children}
    </WalletIslandContext.Provider>
  );
}
