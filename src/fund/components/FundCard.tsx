import { findComponent } from '@/core-react/internal/utils/findComponent';
import { Children, useMemo } from 'react';
import { useTheme } from '../../core-react/internal/hooks/useTheme';
import { background, border, cn, color, text } from '../../styles/theme';
import { DEFAULT_PAYMENT_METHODS } from '../constants';
import { useFundCardFundingUrl } from '../hooks/useFundCardFundingUrl';
import { useFundCardSetupOnrampEventListeners } from '../hooks/useFundCardSetupOnrampEventListeners';
import type { FundCardContentPropsReact, FundCardPropsReact } from '../types';
import { FundButton } from './FundButton';
import FundCardAmountInput from './FundCardAmountInput';
import FundCardAmountInputTypeSwitch from './FundCardAmountInputTypeSwitch';
import { FundCardHeader } from './FundCardHeader';
import { FundCardPaymentMethodDropdown } from './FundCardPaymentMethodDropdown';
import { FundCardProvider, useFundContext } from './FundCardProvider';

export function FundCard({
  children,
  assetSymbol,
  buttonText = 'Buy',
  headerText,
  paymentMethods = DEFAULT_PAYMENT_METHODS,
}: FundCardPropsReact) {
  const componentTheme = useTheme();

  const {
    amountInputComponent,
    headerComponent,
    amountInputTypeSwitchComponent,
    paymentMethodDropdownComponent,
    submitButtonComponent,
  } = useMemo(() => {
    const childrenArray = Children.toArray(children);

    return {
      amountInputComponent: childrenArray.find(
        findComponent(FundCardAmountInput),
      ),
      headerComponent: childrenArray.find(findComponent(FundCardHeader)),
      amountInputTypeSwitchComponent: childrenArray.find(
        findComponent(FundCardAmountInputTypeSwitch),
      ),
      paymentMethodDropdownComponent: childrenArray.find(
        findComponent(FundCardPaymentMethodDropdown),
      ),
      submitButtonComponent: childrenArray.find(findComponent(FundButton)),
    };
  }, [children]);

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
          amountInputTypeSwitchComponent={amountInputTypeSwitchComponent}
          paymentMethodDropdownComponent={paymentMethodDropdownComponent}
          paymentMethods={paymentMethods}
          submitButtonComponent={submitButtonComponent}
        />
      </div>
    </FundCardProvider>
  );
}

function FundCardContent({
  assetSymbol,
  buttonText = 'Buy',
  headerText,
  amountInputComponent,
  headerComponent,
  amountInputTypeSwitchComponent,
  paymentMethodDropdownComponent,
  paymentMethods = DEFAULT_PAYMENT_METHODS,
  submitButtonComponent,
}: FundCardContentPropsReact) {
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
      {headerComponent || (
        <FundCardHeader headerText={headerText} assetSymbol={assetSymbol} />
      )}

      {amountInputComponent || (
        <FundCardAmountInput
          fiatValue={fundAmountFiat}
          setFiatValue={setFundAmountFiat}
          cryptoValue={fundAmountCrypto}
          setCryptoValue={setFundAmountCrypto}
          currencySign="$"
          assetSymbol={assetSymbol}
          inputType={selectedInputType}
          exchangeRate={exchangeRate}
        />
      )}

      {amountInputTypeSwitchComponent || (
        <FundCardAmountInputTypeSwitch
          selectedInputType={selectedInputType}
          setSelectedInputType={setSelectedInputType}
          selectedAsset={selectedAsset}
          fundAmountFiat={fundAmountFiat}
          fundAmountCrypto={fundAmountCrypto}
          exchangeRate={exchangeRate}
          isLoading={exchangeRateLoading}
        />
      )}

      {paymentMethodDropdownComponent || (
        <FundCardPaymentMethodDropdown paymentMethods={paymentMethods} />
      )}

      {submitButtonComponent || (
        <FundButton
          disabled={!fundAmountFiat || !fundAmountCrypto}
          hideIcon={submitButtonState === 'default'}
          text={buttonText}
          className="w-full"
          fundingUrl={fundingUrl}
          state={submitButtonState}
          onClick={() => setSubmitButtonState('loading')}
          onPopupClose={() => setSubmitButtonState('default')}
        />
      )}
    </form>
  );
}
