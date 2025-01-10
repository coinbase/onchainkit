import { useTheme } from '../../core-react/internal/hooks/useTheme';
import { background, border, cn, color, text } from '../../styles/theme';
import { DEFAULT_PAYMENT_METHODS } from '../constants';
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
  paymentMethods = DEFAULT_PAYMENT_METHODS,
  children = <DefaultFundCardContent />,
  className,
}: FundCardPropsReact) {
  const componentTheme = useTheme();

  return (
    <FundCardProvider
      asset={assetSymbol}
      paymentMethods={paymentMethods}
      headerText={headerText}
      buttonText={buttonText}
      country={country}
      subdivision={subdivision}
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
        <form className="w-full" data-testid="ockFundCardForm">
          {children}
        </form>
      </div>
    </FundCardProvider>
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
