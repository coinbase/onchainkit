import { useTheme } from '../../core-react/internal/hooks/useTheme';
import { background, border, cn, color, text } from '../../styles/theme';
import { useExchangeRate } from '../hooks/useExchangeRate';
import { useFundCardFundingUrl } from '../hooks/useFundCardFundingUrl';
import { useFundCardSetupOnrampEventListeners } from '../hooks/useFundCardSetupOnrampEventListeners';
import type { FundCardPropsReact, PaymentMethodReact } from '../types';
import { FundButton } from './FundButton';
import FundCardAmountInput from './FundCardAmountInput';
import FundCardAmountInputTypeSwitch from './FundCardAmountInputTypeSwitch';
import { FundCardHeader } from './FundCardHeader';
import { FundCardPaymentMethodDropdown } from './FundCardPaymentMethodDropdown';
import { FundCardProvider } from './FundCardProvider';
import { useFundContext } from './FundCardProvider';

const defaultPaymentMethods: PaymentMethodReact[] = [
  {
    id: 'FIAT_WALLET',
    name: 'Coinbase',
    description: 'Buy with your Coinbase account',
    icon: 'coinbasePay',
  },
  {
    id: 'APPLE_PAY',
    name: 'Apple Pay',
    description: 'Up to $500/week',
    icon: 'applePay',
  },
  {
    id: 'ACH_BANK_ACCOUNT',
    name: 'Debit Card',
    description: 'Up to $500/week',
    icon: 'creditCard',
  },
];

export function FundCard({
  assetSymbol,
  buttonText = 'Buy',
  headerText,
  amountInputComponent = FundCardAmountInput,
  headerComponent = FundCardHeader,
  amountInputTypeSwithComponent = FundCardAmountInputTypeSwitch,
  paymentMethodDropdownComponent = FundCardPaymentMethodDropdown,
  paymentMethods = defaultPaymentMethods,
  submitButtonComponent = FundButton,
  amountInputSnippets,
}: FundCardPropsReact) {
  const componentTheme = useTheme();

  return (
    <FundCardProvider asset={assetSymbol}>
      <div
        className={cn(
          componentTheme,
          background.default,
          color.foreground,
          'flex w-[440px] flex-col p-6',
          text.headline,
          border.radius,
          border.lineDefault,
        )}
      >
        <FundCardContent
          assetSymbol={assetSymbol}
          buttonText={buttonText}
          headerText={headerText}
          amountInputComponent={amountInputComponent}
          headerComponent={headerComponent}
          amountInputTypeSwithComponent={amountInputTypeSwithComponent}
          paymentMethodDropdownComponent={paymentMethodDropdownComponent}
          paymentMethods={paymentMethods}
          submitButtonComponent={submitButtonComponent}
          amountInputSnippets={amountInputSnippets}
        />
      </div>
    </FundCardProvider>
  );
}

export function FundCardContent({
  assetSymbol,
  buttonText = 'Buy',
  headerText,
  amountInputComponent: AmountInputComponent = FundCardAmountInput,
  headerComponent: HeaderComponent = FundCardHeader,
  amountInputTypeSwithComponent:
    AmountInputTypeSwitchComponent = FundCardAmountInputTypeSwitch,
  paymentMethodDropdownComponent:
    PaymentMethodSelectorDropdownComponent = FundCardPaymentMethodDropdown,
  paymentMethods = defaultPaymentMethods,
  submitButtonComponent: SubmitButtonComponent = FundButton,
  amountInputSnippets,
}: FundCardPropsReact) {
  /**
   * Fetches and sets the exchange rate for the asset
   */
  useExchangeRate(assetSymbol);

  const {
    setFundAmountFiat,
    fundAmountFiat,
    fundAmountCrypto,
    setFundAmountCrypto,
    selectedInputType,
    exchangeRate,
    setSelectedInputType,
    selectedAsset,
    exchangeRateLoading,
    submitButtonState,
    setSubmitButtonState,
  } = useFundContext();

  const fundingUrl = useFundCardFundingUrl();

  // Setup event listeners for the onramp
  useFundCardSetupOnrampEventListeners();

  return (
    <form className="w-full" data-testid="ockFundCardForm">
      <HeaderComponent headerText={headerText} assetSymbol={assetSymbol} />

      <AmountInputComponent
        fiatValue={fundAmountFiat}
        setFiatValue={setFundAmountFiat}
        cryptoValue={fundAmountCrypto}
        setCryptoValue={setFundAmountCrypto}
        currencySign="$"
        assetSymbol={assetSymbol}
        inputType={selectedInputType}
        exchangeRate={exchangeRate}
        amountInputSnippets={amountInputSnippets}
      />

      <AmountInputTypeSwitchComponent
        selectedInputType={selectedInputType}
        setSelectedInputType={setSelectedInputType}
        selectedAsset={selectedAsset}
        fundAmountFiat={fundAmountFiat}
        fundAmountCrypto={fundAmountCrypto}
        exchangeRate={exchangeRate}
        isLoading={exchangeRateLoading}
      />

      <PaymentMethodSelectorDropdownComponent paymentMethods={paymentMethods} />

      <SubmitButtonComponent
        disabled={!fundAmountFiat || !fundAmountCrypto}
        hideIcon={submitButtonState === 'default'}
        text={buttonText}
        className="w-full"
        fundingUrl={fundingUrl}
        state={submitButtonState}
        onClick={() => setSubmitButtonState('loading')}
        onPopupClose={() => setSubmitButtonState('default')}
      />
    </form>
  );
}
