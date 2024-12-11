import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { useValue } from '../../internal/hooks/useValue';
import type { PaymentMethod } from './PaymentMethodSelectorDropdown';

type FundContextType = {
  selectedAsset?: string;
  setSelectedAsset: (asset: string) => void;
  selectedPaymentMethod?: PaymentMethod
  setSelectedPaymentMethod: (paymentMethod: PaymentMethod) => void;
  selectedInputType?: 'fiat' | 'crypto';
  setSelectedInputType: (inputType: 'fiat' | 'crypto') => void;
  fundAmount: string;
  setFundAmount: (amount: string) => void;
};

const initialState = {} as FundContextType;

const FundContext = createContext<FundContextType>(initialState);

type FundProviderReact = {
  children: ReactNode;
  asset: string;
};

export function FundProvider({ children, asset }: FundProviderReact) {
  const [selectedAsset, setSelectedAsset] = useState<string | undefined>(asset);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | undefined>();
  const [selectedInputType, setSelectedInputType] = useState<'fiat' | 'crypto'>('fiat');
  const [fundAmount, setFundAmount] = useState<string>('');

  const value = useValue<FundContextType>({
    selectedAsset,
    setSelectedAsset,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    fundAmount,
    setFundAmount,
    selectedInputType,
    setSelectedInputType,
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
