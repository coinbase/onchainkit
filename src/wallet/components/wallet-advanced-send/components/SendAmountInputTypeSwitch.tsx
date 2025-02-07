import { Skeleton } from '@/internal/components/Skeleton';
import { AmountInputTypeSwitch } from '@/internal/components/amount-input/AmountInputTypeSwitch';
import { cn, color, text } from '@/styles/theme';
import { useSendContext } from './SendProvider';

type SendAmountInputTypeSwitchProps = {
  className?: string;
  loadingDisplay?: React.ReactNode;
};

export function SendAmountInputTypeSwitch({
  loadingDisplay = (
    <div className={cn(text.caption, color.foregroundMuted, 'h-[1.625rem]')}>
      Exchange rate unavailable
    </div>
  ),
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
  // SendAmountInputTypeSwitch uses skeleton for the loading display
  // SendAmountInputTypeSwitch uses a custom error display (see loadingDisplay default)
  if (exchangeRateLoading) {
    return <Skeleton className="h-[1.625rem]" />;
  }

  return (
    <AmountInputTypeSwitch
      asset={selectedToken?.symbol ?? ''}
      fiatAmount={fiatAmount ?? ''}
      cryptoAmount={cryptoAmount ?? ''}
      exchangeRate={exchangeRate}
      exchangeRateLoading={false}
      loadingDisplay={loadingDisplay}
      currency="USD"
      selectedInputType={selectedInputType}
      setSelectedInputType={setSelectedInputType}
      className={className}
    />
  );
}
