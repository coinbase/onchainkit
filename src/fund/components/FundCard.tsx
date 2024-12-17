import { useTheme } from '../../core-react/internal/hooks/useTheme';
import { background, border, cn, color, text } from '../../styles/theme';
import { FundCardProvider } from './FundCardProvider';
import { useExchangeRate } from '../hooks/useExchangeRate';
import { useEffect, useMemo } from 'react';
import { useFundContext } from './FundCardProvider';
import { FundButton } from './FundButton';
import { FundCardHeader } from './FundCardHeader';
import { FundCardPaymentMethodSelectorDropdown } from './FundCardPaymentMethodSelectorDropdown';
import FundCardAmountInput from './FundCardAmountInput';
import { FUND_BUTTON_RESET_TIMEOUT, ONRAMP_BUY_URL } from '../constants';
import { setupOnrampEventListeners } from '../utils/setupOnrampEventListeners';
import type { FundCardPropsReact, PaymentMethodReact } from '../types';
import FundCardAmountInputTypeSwitch from './FundCardAmountInputTypeSwitch';

const defaultPaymentMethods: PaymentMethodReact[] = [
  {
    id: 'CRYPTO_ACCOUNT',
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
  paymentMethodSelectorDropdownComponent = FundCardPaymentMethodSelectorDropdown,
  paymentMethods = defaultPaymentMethods,
  submitButtonComponent = FundButton,
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
          border.lineDefault
        )}
      >
        <FundCardContent
          assetSymbol={assetSymbol}
          buttonText={buttonText}
          headerText={headerText}
          amountInputComponent={amountInputComponent}
          headerComponent={headerComponent}
          amountInputTypeSwithComponent={amountInputTypeSwithComponent}
          paymentMethodSelectorDropdownComponent={
            paymentMethodSelectorDropdownComponent
          }
          paymentMethods={paymentMethods}
          submitButtonComponent={submitButtonComponent}
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
    AmountInputTypeSwitch = FundCardAmountInputTypeSwitch,
  paymentMethodSelectorDropdownComponent:
    PaymentMethodSelectorDropdown = FundCardPaymentMethodSelectorDropdown,
  paymentMethods = defaultPaymentMethods,
  submitButtonComponent: SubmitButton = FundButton,
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
    selectedPaymentMethod,
    selectedInputType,
    exchangeRate,
    setSelectedInputType,
    selectedAsset,
    exchangeRateLoading,
    submitButtonState,
    setSubmitButtonState,
  } = useFundContext();

  const fundAmount =
    selectedInputType === 'fiat' ? fundAmountFiat : fundAmountCrypto;

  const fundingUrl = useMemo(() => {
    if (selectedInputType === 'fiat') {
      return `${ONRAMP_BUY_URL}/one-click?appId=6eceb045-266a-4940-9d22-35952496ff00&addresses={"0x438BbEF3525eF1b0359160FD78AF9c1158485d87":["base"]}&assets=["${assetSymbol}"]&presetFiatAmount=${fundAmount}&defaultPaymentMethod=${selectedPaymentMethod?.id}`;
    }

    return `${ONRAMP_BUY_URL}/one-click?appId=6eceb045-266a-4940-9d22-35952496ff00&addresses={"0x438BbEF3525eF1b0359160FD78AF9c1158485d87":["base"]}&assets=["${assetSymbol}"]&presetCryptoAmount=${fundAmount}&defaultPaymentMethod=${selectedPaymentMethod?.id}`;
  }, [assetSymbol, fundAmount, selectedPaymentMethod, selectedInputType]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Only want to run this effect once
  useEffect(() => {
    setupOnrampEventListeners({
      onEvent: (event) => {
        if (event.eventName === 'error') {
          setSubmitButtonState('error');

          setTimeout(() => {
            setSubmitButtonState('default');
          }, FUND_BUTTON_RESET_TIMEOUT);
        }
      },
      onExit: (event) => {
        setSubmitButtonState('default');
        console.log('onExit', event);
      },
      onSuccess: () => {
        setSubmitButtonState('success');

        setTimeout(() => {
          setSubmitButtonState('default');
        }, FUND_BUTTON_RESET_TIMEOUT);
      },
    });
  }, []);

  return (
    <form className="w-full">
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
      />

      <AmountInputTypeSwitch
        selectedInputType={selectedInputType}
        setSelectedInputType={setSelectedInputType}
        selectedAsset={selectedAsset}
        fundAmountFiat={fundAmountFiat}
        fundAmountCrypto={fundAmountCrypto}
        exchangeRate={exchangeRate}
        isLoading={exchangeRateLoading}
      />

      <PaymentMethodSelectorDropdown paymentMethods={paymentMethods} />

      <SubmitButton
        disabled={!fundAmount}
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
