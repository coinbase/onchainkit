import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useValue } from '../../core-react/internal/hooks/useValue';
// import { DEFAULT_PAYMENT_METHODS } from '../constants';
import type {
  AmountInputSnippetReact,
  AmountInputTypeReact,
  EventMetadata,
  FundButtonStateReact,
  FundCardProviderReact,
  OnrampError,
  PaymentMethodReact,
} from '../types';
import { buildPaymentMethods } from '../utils/buildPaymentMethods';
import { fetchOnrampOptions } from '../utils/fetchOnrampOptions';
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
  paymentOptionsLoading: boolean;
  headerText?: string;
  buttonText?: string;
  country: string;
  subdivision?: string;
  inputType?: AmountInputTypeReact;
  onError?: (e: OnrampError | undefined) => void;
  onStatus?: (lifecycleStatus: EventMetadata) => void;
  onSuccess?: () => void;
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
  const [paymentOptionsLoading, setPaymentOptionsLoading] =
    useState<boolean>(true);

  const [submitButtonState, setSubmitButtonState] =
    useState<FundButtonStateReact>('default');

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodReact[]>(
    [],
  );

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

  const fetchPaymentOptions = useCallback(async () => {
    setPaymentOptionsLoading(true);

    const paymentOptions = await fetchOnrampOptions({
      country,
      subdivision,
    });

    const paymentMethods = buildPaymentMethods(paymentOptions, currency);

    setPaymentMethods(paymentMethods);

    setPaymentOptionsLoading(false);
  }, [country, subdivision, currency]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: One time effect
  useEffect(() => {
    fetchExchangeRate();
    fetchPaymentOptions();
  }, []);

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
    paymentOptionsLoading,
    headerText,
    buttonText,
    country,
    subdivision,
    onError,
    onStatus,
    onSuccess,
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
