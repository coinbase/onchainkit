import { useDebounce } from '@/core-react/internal/hooks/useDebounce';
import { createContext, useContext, useEffect, useState } from 'react';
import { useValue } from '../../core-react/internal/hooks/useValue';
import type {
  FundButtonStateReact,
  FundCardProviderReact,
  PaymentMethodReact,
} from '../types';
import { fetchOnrampQuote } from '../utils/fetchOnrampQuote';

type FundCardContextType = {
  selectedAsset: string;
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
  submitButtonState: FundButtonStateReact;
  setSubmitButtonState: (state: FundButtonStateReact) => void;
};

const FundContext = createContext<FundCardContextType | undefined>(undefined);

export function FundCardProvider({ children, asset }: FundCardProviderReact) {
  const [selectedAsset, setSelectedAsset] = useState<string>(asset);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    PaymentMethodReact | undefined
  >();
  const [selectedInputType, setSelectedInputType] = useState<'fiat' | 'crypto'>(
    'fiat',
  );
  const [fundAmountFiat, setFundAmountFiat] = useState<string>('');
  const [fundAmountCrypto, setFundAmountCrypto] = useState<string>('');
  const [exchangeRate, setExchangeRate] = useState<number | undefined>();
  const [exchangeRateLoading, setExchangeRateLoading] = useState<
    boolean | undefined
  >();
  const [submitButtonState, setSubmitButtonState] =
    useState<FundButtonStateReact>('default');

  const fetchExchangeRate = useDebounce(async () => {
    setExchangeRateLoading(true);
    const quote = await fetchOnrampQuote({
      purchaseCurrency: selectedAsset,
      paymentCurrency: 'USD',
      paymentAmount: '100',
      paymentMethod: 'CARD',
      country: 'US',
    });

    setExchangeRateLoading(false);

    setExchangeRate(
      Number(quote.purchaseAmount.value) / Number(quote.paymentSubtotal.value),
    );
  }, 1000);

  // biome-ignore lint/correctness/useExhaustiveDependencies: One time effect
  useEffect(() => {
    fetchExchangeRate();
  }, []);

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
    submitButtonState,
    setSubmitButtonState,
  });
  return <FundContext.Provider value={value}>{children}</FundContext.Provider>;
}

export function useFundContext() {
  const context = useContext(FundContext);

  if (!context) {
    throw new Error('useFundContext must be used within a FundCardProvider');
  }

  return context;
}
