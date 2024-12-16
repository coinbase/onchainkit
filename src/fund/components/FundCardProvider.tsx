import { createContext, useContext, useState } from 'react';
import { useValue } from '../../core-react/internal/hooks/useValue';
import type { FundCardProviderReact, PaymentMethodReact } from '../types';

type FundCardContextType = {
  selectedAsset?: string;
  setSelectedAsset: (asset: string) => void;
  selectedPaymentMethod?: PaymentMethodReact;
  setSelectedPaymentMethod: (paymentMethod: PaymentMethodReact) => void;
  selectedInputType?: 'fiat' | 'crypto';
  setSelectedInputType: (inputType: 'fiat' | 'crypto') => void;
  fundAmountFiat: string;
  setFundAmountFiat: (amount: string) => void;
  fundAmountCrypto: string;
  setFundAmountCrypto: (amount: string) => void;
  exchangeRate?: number;
  setExchangeRate: (exchangeRate: number) => void;
  exchangeRateLoading?: boolean;
  setExchangeRateLoading: (loading: boolean) => void;
  submitButtonLoading?: boolean;
  setSubmitButtonLoading: (loading: boolean) => void;
};

const initialState = {} as FundCardContextType;

const FundContext = createContext<FundCardContextType>(initialState);

export function FundCardProvider({ children, asset }: FundCardProviderReact) {
  const [selectedAsset, setSelectedAsset] = useState<string | undefined>(asset);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodReact | undefined>();
  const [selectedInputType, setSelectedInputType] = useState<'fiat' | 'crypto'>('fiat');
  const [fundAmountFiat, setFundAmountFiat] = useState<string>('');
  const [fundAmountCrypto, setFundAmountCrypto] = useState<string>('');
  const [exchangeRate, setExchangeRate] = useState<number | undefined>();
  const [exchangeRateLoading, setExchangeRateLoading] = useState<boolean | undefined>();
  const [submitButtonLoading, setSubmitButtonLoading] = useState<boolean | undefined>();

  const value = useValue<FundCardContextType>({
    selectedAsset,
    setSelectedAsset,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    fundAmountFiat,
    setFundAmountFiat,
    fundAmountCrypto,
    setFundAmountCrypto,
    selectedInputType,
    setSelectedInputType,
    exchangeRate,
    setExchangeRate,
    exchangeRateLoading,
    setExchangeRateLoading,
    submitButtonLoading,
    setSubmitButtonLoading,
  });
  return <FundContext.Provider value={value}>{children}</FundContext.Provider>;
}

export function useFundContext() {
  const context = useContext(FundContext);

  if (context === undefined) {
    throw new Error('useFundContext must be used within a FundCardProvider');
  }

  return context;
}
