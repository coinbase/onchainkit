import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useValue } from '../../core-react/internal/hooks/useValue';
import { useEmitLifecycleStatus } from '../hooks/useEmitLifecycleStatus';
import { usePaymentMethods } from '../hooks/usePaymentMethods';
import type {
  AmountInputSnippetReact,
  AmountInputTypeReact,
  FundButtonStateReact,
  FundCardProviderReact,
  LifecycleStatus,
  LifecycleStatusUpdate,
  PaymentMethodReact,
} from '../types';
import { fetchOnrampQuote } from '../utils/fetchOnrampQuote';

type FundCardContextType = {
  asset: string;
  currency: string;
  selectedPaymentMethod?: PaymentMethodReact;
  setSelectedPaymentMethod: (paymentMethod: PaymentMethodReact) => void;
  selectedInputType?: AmountInputTypeReact;
  setSelectedInputType: (inputType: AmountInputTypeReact) => void;
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
  paymentMethods: PaymentMethodReact[];
  setPaymentMethods: (paymentMethods: PaymentMethodReact[]) => void;
  paymentMethodsLoading: boolean;
  setPaymentMethodsLoading: (loading: boolean) => void;
  headerText?: string;
  buttonText?: string;
  country: string;
  subdivision?: string;
  inputType?: 'fiat' | 'crypto';
  lifecycleStatus: LifecycleStatus;
  updateLifecycleStatus: (newStatus: LifecycleStatusUpdate) => void;
  amountInputSnippets?: AmountInputSnippetReact[];
};

const FundContext = createContext<FundCardContextType | undefined>(undefined);

export function FundCardProvider({
  children,
  asset,
  currency = 'USD',
  headerText = `Buy ${asset.toUpperCase()}`,
  buttonText,
  country,
  subdivision,
  inputType,
  onError,
  onStatus,
  onSuccess,
  amountInputSnippets,
}: FundCardProviderReact) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    PaymentMethodReact | undefined
  >();
  const [selectedInputType, setSelectedInputType] =
    useState<AmountInputTypeReact>(inputType || 'fiat');
  const [fundAmountFiat, setFundAmountFiat] = useState<string>('');
  const [fundAmountCrypto, setFundAmountCrypto] = useState<string>('');
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [exchangeRateLoading, setExchangeRateLoading] = useState<boolean>(true);

  const [submitButtonState, setSubmitButtonState] =
    useState<FundButtonStateReact>('default');

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodReact[]>(
    [],
  );
  const [paymentMethodsLoading, setPaymentMethodsLoading] =
    useState<boolean>(true);
  const { lifecycleStatus, updateLifecycleStatus } = useEmitLifecycleStatus({
    onError,
    onSuccess,
    onStatus,
  });

  const fetchExchangeRate = useCallback(async () => {
    setExchangeRateLoading(true);

    const quote = await fetchOnrampQuote({
      purchaseCurrency: asset,
      paymentCurrency: currency,
      paymentAmount: '100',
      paymentMethod: 'CARD',
      country,
      subdivision,
    });

    setExchangeRateLoading(false);

    setExchangeRate(
      Number(quote.purchaseAmount.value) / Number(quote.paymentSubtotal.value),
    );
  }, [asset, country, subdivision, currency]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: One time effect
  useEffect(() => {
    fetchExchangeRate();
  }, []);

  // Fetches and sets the payment methods to the context
  usePaymentMethods({
    country,
    subdivision,
    currency,
    setPaymentMethods,
    setPaymentMethodsLoading,
  });

  const value = useValue<FundCardContextType>({
    asset,
    currency,
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
    paymentMethods,
    setPaymentMethods,
    paymentMethodsLoading,
    setPaymentMethodsLoading,
    headerText,
    buttonText,
    country,
    subdivision,
    lifecycleStatus,
    updateLifecycleStatus,
    amountInputSnippets,
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
