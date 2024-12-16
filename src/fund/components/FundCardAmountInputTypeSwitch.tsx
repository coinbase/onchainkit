import { cn, color, pressable, text } from '../../styles/theme';
import { useCallback, useMemo } from 'react';
import { useTheme } from '../../core-react/internal/hooks/useTheme';
import { getRoundedAmount } from '../../core/utils/getRoundedAmount';
import { useIcon } from '../../core-react/internal/hooks/useIcon';
import { Skeleton } from '../../internal/components/Skeleton';
import type { FundCardAmountInputTypeSwitchPropsReact } from '../types';

export const FundCardAmountInputTypeSwitch = ({
  selectedInputType,
  setSelectedInputType,
  selectedAsset,
  fundAmountFiat,
  fundAmountCrypto,
  exchangeRate,
  isLoading,
}: FundCardAmountInputTypeSwitchPropsReact) => {
  const componentTheme = useTheme();

  const iconSvg = useIcon({ icon: 'toggle' });

  const handleToggle = () => {
    setSelectedInputType(selectedInputType === 'fiat' ? 'crypto' : 'fiat');
  };

  const formatUSD = useCallback((amount: string) => {
    if (!amount || amount === '0') {
      return null;
    }
    const roundedAmount = Number(getRoundedAmount(amount, 2));
    return `$${roundedAmount.toFixed(2)}`;
  }, []);

  const exchangeRateLine = useMemo(() => {
    return (
      <span
        className={cn(
          text.label2,
          color.foregroundMuted,
          'font-normal',
          'pl-1'
        )}
      >
        ({formatUSD('1')} = {exchangeRate?.toFixed(8)} {selectedAsset})
      </span>
    );
  }, [formatUSD, exchangeRate, selectedAsset]);

  const cryptoAmountLine = useMemo(() => {
    return (
      <span className={cn(componentTheme, text.label1)}>
        {Number(fundAmountCrypto).toFixed(8)} {selectedAsset}
      </span>
    );
  }, [fundAmountCrypto, selectedAsset, componentTheme]);

  const fiatAmountLine = useMemo(() => {
    return (
      <span className={cn(componentTheme, text.label1)}>
        {formatUSD(fundAmountFiat)}
      </span>
    );
  }, [formatUSD, fundAmountFiat, componentTheme]);

  if(isLoading || !exchangeRate) {
    return<Skeleton className="h-[1.625rem]" /> 
  }

  return (
    <div className="flex items-center">
      <button
        type="button"
        aria-label="amount type switch"
        className={cn(
          pressable.default,
          'mr-1 rounded-full p-1 opacity-50 transition-opacity hover:opacity-100'
        )}
        onClick={handleToggle}
      >
        <div className="h-[1.125rem] w-[1.125rem]">{iconSvg}</div>
      </button>
      <div style={textStyle}>
        {selectedInputType === 'fiat' ? cryptoAmountLine : fiatAmountLine}

        {exchangeRateLine}
      </div>
    </div>
  );
};

const textStyle = {
  textOverflow: 'ellipsis',
  width: '390px',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
};

export default FundCardAmountInputTypeSwitch;
