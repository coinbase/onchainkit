import type { LifecycleStatusUpdate } from '@/internal/types';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useValue } from '../../internal/hooks/useValue';
import { useEmitLifecycleStatus } from '../hooks/useEmitLifecycleStatus';
import { usePaymentMethods } from '../hooks/usePaymentMethods';
import type {
  AmountInputType,
  FundButtonStateReact,
  FundCardProviderReact,
  LifecycleStatus,
  PaymentMethod,
  PresetAmountInputs,
} from '../types';
import { fetchOnrampQuote } from '../utils/fetchOnrampQuote';

type FundCardContextType = {
  asset: string;
  currency: string;
  selectedPaymentMethod?: PaymentMethod;
  setSelectedPaymentMethod: (paymentMethod: PaymentMethod) => void;
  selectedInputType: AmountInputType;
  setSelectedInputType: (inputType: AmountInputType) => void;
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
  paymentMethods: PaymentMethod[];
  setPaymentMethods: (paymentMethods: PaymentMethod[]) => void;
  isPaymentMethodsLoading: boolean;
  setIsPaymentMethodsLoading: (loading: boolean) => void;
  headerText?: string;
  buttonText?: string;
  country: string;
  subdivision?: string;
  inputType?: 'fiat' | 'crypto';
  lifecycleStatus: LifecycleStatus;

  presetAmountInputs?: PresetAmountInputs;
  updateLifecycleStatus: (
    newStatus: LifecycleStatusUpdate<LifecycleStatus>,
  ) => void;
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
  presetAmountInputs,
}: FundCardProviderReact) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    PaymentMethod | undefined
  >();
  const [selectedInputType, setSelectedInputType] = useState<AmountInputType>(
    inputType || 'fiat',
  );
  const [fundAmountFiat, setFundAmountFiat] = useState<string>('');
  const [fundAmountCrypto, setFundAmountCrypto] = useState<string>('');
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [exchangeRateLoading, setExchangeRateLoading] = useState<boolean>(true);

  const [submitButtonState, setSubmitButtonState] =
    useState<FundButtonStateReact>('default');

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isPaymentMethodsLoading, setIsPaymentMethodsLoading] =
    useState<boolean>(true);
  const { lifecycleStatus, updateLifecycleStatus } = useEmitLifecycleStatus({
    onError,
    onSuccess,
    onStatus,
  });

  const fetchExchangeRate = useCallback(async () => {
    setExchangeRateLoading(true);

    try {
      const quote = await fetchOnrampQuote({
        purchaseCurrency: asset,
        paymentCurrency: currency,
        paymentAmount: '100',
        paymentMethod: 'CARD',
        country,
        subdivision,
      });

      setExchangeRate(
        Number(quote.purchaseAmount.value) /
          Number(quote.paymentSubtotal.value),
      );
    } catch (err) {
      if (err instanceof Error) {
        console.error('Error fetching exchange rate:', err);
        onError?.({
          errorType: 'handled_error',
          code: 'EXCHANGE_RATE_ERROR',
          debugMessage: err.message,
        });
      }
    } finally {
      setExchangeRateLoading(false);
    }
  }, [asset, country, subdivision, currency, onError]);

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
    setIsPaymentMethodsLoading,
    onError,
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
    isPaymentMethodsLoading,
    setIsPaymentMethodsLoading,
    headerText,
    buttonText,
    country,
    subdivision,
    lifecycleStatus,
    updateLifecycleStatus,
    presetAmountInputs,
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
