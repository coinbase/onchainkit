import { Skeleton } from '@/internal/components/Skeleton';
import { AmountInputTypeSwitch } from '@/internal/components/amount-input/AmountInputTypeSwitch';
import { cn, color, text } from '@/styles/theme';
import { useSendContext } from './SendProvider';

type SendAmountInputTypeSwitchProps = {
  errorDisplay?: React.ReactNode;
  className?: string;
};

export function SendAmountInputTypeSwitch({
  errorDisplay,
  className,
}: SendAmountInputTypeSwitchProps) {
  const {
    selectedToken,
    fiatAmount,
    cryptoAmount,
    exchangeRate,
    exchangeRateLoading,
    selectedInputType,
    setSelectedInputType,
  } = useSendContext();

  // AmountInputTypeSwitch uses a skeleton for both loading and error states
  // SendAmountInputTypeSwitch uses skeleton for the loading display but a custom error display (see loadingDisplay default)
  if (exchangeRateLoading) {
    return <Skeleton className="h-[1.625rem]" />;
  }

  if (!exchangeRate) {
    if (errorDisplay) {
      return errorDisplay;
    }

    return (
      <div
        data-testid="ockSendAmountInputTypeSwitch_ErrorDisplay"
        className={cn(text.caption, color.foregroundMuted, 'h-[1.625rem]')}
      >
        Exchange rate unavailable
      </div>
    );
  }

  return (
    <AmountInputTypeSwitch
      asset={selectedToken?.symbol ?? ''}
      fiatAmount={fiatAmount ?? ''}
      cryptoAmount={cryptoAmount ?? ''}
      exchangeRate={exchangeRate}
      exchangeRateLoading={false}
      currency="USD"
      selectedInputType={selectedInputType}
      setSelectedInputType={setSelectedInputType}
      className={className}
    />
  );
}
