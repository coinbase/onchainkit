import { formatFiatAmount } from '@/core/utils/formatFiatAmount';
import { useCallback, useMemo } from 'react';
import { useIcon } from '../../core-react/internal/hooks/useIcon';
import { Skeleton } from '../../internal/components/Skeleton';
import { cn, pressable, text } from '../../styles/theme';
import type { FundCardAmountInputTypeSwitchPropsReact } from '../types';
import { truncateDecimalPlaces } from '../utils/truncateDecimalPlaces';
import { useFundContext } from './FundCardProvider';

export const FundCardAmountInputTypeSwitch = ({
  className,
}: FundCardAmountInputTypeSwitchPropsReact) => {
  const {
    selectedInputType,
    setSelectedInputType,
    asset,
    fundAmountFiat,
    fundAmountCrypto,
    exchangeRate,
    exchangeRateLoading,
    currency,
  } = useFundContext();

  const iconSvg = useIcon({ icon: 'toggle' });

  const handleToggle = useCallback(() => {
    setSelectedInputType(selectedInputType === 'fiat' ? 'crypto' : 'fiat');
  }, [selectedInputType, setSelectedInputType]);

  const formatCrypto = useCallback(
    (amount: string) => {
      return `${truncateDecimalPlaces(amount || '0', 8)} ${asset}`;
    },
    [asset],
  );

  const amountLine = useMemo(() => {
    return (
      <span data-testid="ockAmountLine" className={cn(text.label1)}>
        {selectedInputType === 'fiat'
          ? formatCrypto(fundAmountCrypto)
          : formatFiatAmount({
              amount: fundAmountFiat,
              currency: currency,
              minimumFractionDigits: 0,
            })}
      </span>
    );
  }, [
    fundAmountCrypto,
    fundAmountFiat,
    selectedInputType,
    formatCrypto,
    currency,
  ]);

  if (exchangeRateLoading || !exchangeRate) {
    return <Skeleton className="h-[1.625rem]" />;
  }

  return (
    <div className={cn('flex items-center', className)}>
      <button
        type="button"
        aria-label="amount type switch"
        className={cn(
          pressable.default,
          'mr-1 rounded-full p-1 opacity-50 transition-opacity hover:opacity-100',
        )}
        data-testid="ockAmountTypeSwitch"
        onClick={handleToggle}
      >
        <div className="h-[1.125rem] w-[1.125rem]">{iconSvg}</div>
      </button>
      <div className="w-full truncate">{amountLine}</div>
    </div>
  );
};

export default FundCardAmountInputTypeSwitch;
