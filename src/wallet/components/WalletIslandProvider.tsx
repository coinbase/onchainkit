import { useValue } from '@/core-react/internal/hooks/useValue';
import { usePortfolioTokenBalances } from '@/core-react/wallet/hooks/usePortfolioTokenBalances';
import type {
  PortfolioTokenBalances,
  PortfolioTokenWithFiatValue,
} from '@/core/api/types';
import type { QueryObserverResult } from '@tanstack/react-query';
import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';
import { useWalletContext } from './WalletProvider';

export type WalletIslandContextType = {
  showSwap: boolean;
  setShowSwap: Dispatch<SetStateAction<boolean>>;
  isSwapClosing: boolean;
  setIsSwapClosing: Dispatch<SetStateAction<boolean>>;
  showQr: boolean;
  setShowQr: Dispatch<SetStateAction<boolean>>;
  isQrClosing: boolean;
  setIsQrClosing: Dispatch<SetStateAction<boolean>>;
  tokenBalances: PortfolioTokenWithFiatValue[] | undefined;
  portfolioFiatValue: number | undefined;
  refetchPortfolioData: () => Promise<QueryObserverResult<PortfolioTokenBalances[], Error>>;
  isFetchingPortfolioData: boolean;
  portfolioDataUpdatedAt: number | undefined;
};

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
  } = usePortfolioTokenBalances({ addresses: [address ?? '0x000'] });

  const portfolioFiatValue = portfolioData?.[0]?.portfolio_balance_usd;
  const tokenBalances = portfolioData?.[0]?.token_balances;

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
    refetchPortfolioData,
    isFetchingPortfolioData,
    portfolioDataUpdatedAt,
  });

  return (
    <WalletIslandContext.Provider value={value}>
      {children}
    </WalletIslandContext.Provider>
  );
}
