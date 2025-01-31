import { Skeleton } from '@/internal/components/Skeleton';
import { AmountInputTypeSwitch } from '@/internal/components/amount-input/AmountInputTypeSwitch';
import { cn, color, text } from '@/styles/theme';
import type { SendAmountInputProps } from '../types';

export function SendAmountInputTypeSwitch({
  exchangeRateLoading,
  exchangeRate,
  selectedToken,
  fiatAmount,
  cryptoAmount,
  selectedInputType,
  setSelectedInputType,
}: Pick<
  SendAmountInputProps,
  | 'exchangeRateLoading'
  | 'exchangeRate'
  | 'selectedToken'
  | 'fiatAmount'
  | 'cryptoAmount'
  | 'selectedInputType'
  | 'setSelectedInputType'
>) {
  if (exchangeRateLoading) {
    return <Skeleton className="h-[1.625rem]" />;
  }

  const loadingDisplay = (
    <div className={cn(text.caption, color.foregroundMuted, 'h-[1.625rem]')}>
      Exchange rate unavailable
    </div>
  );

  return (
    <AmountInputTypeSwitch
      asset={selectedToken?.symbol ?? ''}
      fiatAmount={fiatAmount ?? ''}
      cryptoAmount={cryptoAmount ?? ''}
      exchangeRate={exchangeRate}
      exchangeRateLoading={false}
      loadingDisplay={loadingDisplay}
      currency={'USD'}
      selectedInputType={selectedInputType}
      setSelectedInputType={setSelectedInputType}
    />
  );
}
