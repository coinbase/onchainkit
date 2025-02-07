import { cn, pressable, text } from '@/styles/theme';
import { useCallback, useMemo } from 'react';
import { useIcon } from '../../hooks/useIcon';
import { formatFiatAmount } from '../../utils/formatFiatAmount';
import { truncateDecimalPlaces } from '../../utils/truncateDecimalPlaces';
import { Skeleton } from '../Skeleton';

type AmountInputTypeSwitchPropsReact = {
  selectedInputType: 'fiat' | 'crypto';
  setSelectedInputType: (type: 'fiat' | 'crypto') => void;
  asset: string;
  fiatAmount: string;
  cryptoAmount: string;
  exchangeRate: number;
  exchangeRateLoading: boolean;
  loadingDisplay?: React.ReactNode;
  currency: string;
  className?: string;
};

export function AmountInputTypeSwitch({
  selectedInputType,
  setSelectedInputType,
  asset,
  fiatAmount,
  cryptoAmount,
  exchangeRate,
  exchangeRateLoading,
  currency,
  loadingDisplay = <Skeleton className="h-[1.625rem]" />,
  className,
}: AmountInputTypeSwitchPropsReact) {
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
          ? formatCrypto(cryptoAmount)
          : formatFiatAmount({
              amount: fiatAmount,
              currency: currency,
              minimumFractionDigits: 0,
            })}
      </span>
    );
  }, [cryptoAmount, fiatAmount, selectedInputType, formatCrypto, currency]);

  if (exchangeRateLoading || !exchangeRate) {
    return loadingDisplay;
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
}
