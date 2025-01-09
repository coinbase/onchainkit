import { useMemo } from 'react';
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
  assetSymbol,
  buttonText = 'Buy',
  headerText,
  currencySign = '$',
  paymentMethods = DEFAULT_PAYMENT_METHODS,
  children,
  className,
}: FundCardPropsReact) {
  const componentTheme = useTheme();

  const defaultChildren = useMemo(
    () => (
      <>
        <FundCardHeader />
        <FundCardAmountInput />
        <FundCardAmountInputTypeSwitch />
        <FundCardPaymentMethodDropdown />
      </>
    ),
    [],
  );

  return (
    <FundCardProvider
      asset={assetSymbol}
      paymentMethods={paymentMethods}
      headerText={headerText}
      buttonText={buttonText}
      currencySign={currencySign}
    >
      <div
        className={cn(
          componentTheme,
          background.default,
          color.foreground,
          'flex w-[440px] flex-col p-6',
          text.headline,
          border.radius,
          border.lineDefault,
          className,
        )}
      >
        <FundCardContent>{children ?? defaultChildren}</FundCardContent>
      </div>
    </FundCardProvider>
  );
}

function FundCardContent({ children }: FundCardContentPropsReact) {
  const {
    fundAmountFiat,
    fundAmountCrypto,
    submitButtonState,
    setSubmitButtonState,
    buttonText,
  } = useFundContext();

  const fundingUrl = useFundCardFundingUrl();

  // Setup event listeners for the onramp
  useFundCardSetupOnrampEventListeners();

  return (
    <form className="w-full" data-testid="ockFundCardForm">
      {children}

      <FundButton
        disabled={!fundAmountFiat && !fundAmountCrypto}
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
