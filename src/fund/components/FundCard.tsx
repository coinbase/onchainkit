import type { ReactNode } from 'react';
import { useTheme } from '../../core-react/internal/hooks/useTheme';
import { background, border, cn, color, text } from '../../styles/theme';
import { DEFAULT_PAYMENT_METHODS } from '../constants';
import { useFundCardSetupOnrampEventListeners } from '../hooks/useFundCardSetupOnrampEventListeners';
import type { FundCardPropsReact } from '../types';
import FundCardAmountInput from './FundCardAmountInput';
import FundCardAmountInputTypeSwitch from './FundCardAmountInputTypeSwitch';
import { FundCardHeader } from './FundCardHeader';
import { FundCardPaymentMethodDropdown } from './FundCardPaymentMethodDropdown';
import { FundCardProvider } from './FundCardProvider';
import { FundCardSubmitButton } from './FundCardSubmitButton';

export function FundCard({
  assetSymbol,
  buttonText = 'Buy',
  headerText,
  country = 'US',
  subdivision,
  amountInputSnippets,
  children = <DefaultFundCardContent />,
  className,
  onError,
  onStatus,
  onSuccess,
}: FundCardPropsReact) {
  const componentTheme = useTheme();

  return (
    <FundCardProvider
      asset={assetSymbol}
      paymentMethods={DEFAULT_PAYMENT_METHODS}
      headerText={headerText}
      buttonText={buttonText}
      country={country}
      subdivision={subdivision}
      onError={onError}
      onStatus={onStatus}
      onSuccess={onSuccess}
      amountInputSnippets={amountInputSnippets}
    >
      <div
        className={cn(
          componentTheme,
          background.default,
          color.foreground,
          'flex w-full flex-col p-6',
          text.headline,
          border.radius,
          border.lineDefault,
          className,
        )}
      >
        <FundCardContent>{children}</FundCardContent>
      </div>
    </FundCardProvider>
  );
}

function FundCardContent({ children }: { children: ReactNode }) {
  // Setup event listeners for the onramp
  useFundCardSetupOnrampEventListeners();
  return (
    <form className="w-full" data-testid="ockFundCardForm">
      {children}
    </form>
  );
}

function DefaultFundCardContent() {
  return (
    <>
      <FundCardHeader />
      <FundCardAmountInput />
      <FundCardAmountInputTypeSwitch />
      <FundCardPaymentMethodDropdown />
      <FundCardSubmitButton />
    </>
  );
}
