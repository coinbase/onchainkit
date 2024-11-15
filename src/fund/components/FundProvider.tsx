import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { useValue } from '../../internal/hooks/useValue';

type FundContextType = {
  selectedAsset?: string;
  setSelectedAsset: (asset: string) => void;
  fundAmount: string;
  setFundAmount: (amount: string) => void;
};

const initialState = {} as FundContextType;

const FundContext = createContext<FundContextType>(initialState);

type FundProviderReact = {
  children: ReactNode;
};

export function FundProvider({ children }: FundProviderReact) {
  const [selectedAsset, setSelectedAsset] = useState<string | undefined>();
  const [fundAmount, setFundAmount] = useState<string>('');

  const value = useValue<FundContextType>({
    selectedAsset,
    setSelectedAsset,
    fundAmount,
    setFundAmount,
  });
  return <FundContext.Provider value={value}>{children}</FundContext.Provider>;
}

export function useFundContext() {
  const context = useContext(FundContext);

  if (context === undefined) {
    throw new Error('useFundContext must be used within a FundProvider');
  }

  return context;
}
