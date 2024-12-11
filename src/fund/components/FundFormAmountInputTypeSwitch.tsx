import { cn, pressable } from '../../styles/theme';
import { useTheme } from '../../useTheme';
import { useIcon } from '../../internal/hooks/useIcon';
import { useFundContext } from './FundProvider';
import { getRoundedAmount } from '../../internal/utils/getRoundedAmount';
import { useCallback, useMemo } from 'react';

export const FundFormAmountInputTypeSwitch = () => {
  const componentTheme = useTheme();
  const { selectedInputType, setSelectedInputType, selectedAsset, fundAmount } =
    useFundContext();

  const iconSvg = useIcon({ icon: 'toggle' });

  const handleToggle = () => {
    console.log('Toggle');
  };

  const formatUSD = useCallback((amount: string) => {
    if (!amount || amount === '0') {
      return null;
    }
    const roundedAmount = Number(getRoundedAmount(amount, 2));
    return `$${roundedAmount.toFixed(2)}`;
  }, []);

  const exchangeRate = useMemo(() => {
    return `(${formatUSD('1')} = 1 USDC)`
  }, [formatUSD]);

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
      <div>
        {selectedInputType === 'fiat' ? (
          <span className={cn(componentTheme, 'text-[12px]')}>
            {formatUSD(fundAmount)} {exchangeRate}
          </span>
        ) : (
          <span className={cn(componentTheme, 'text-[12px]')}>
            10 {selectedAsset} ($1 = 1 USDC)
          </span>
        )}
      </div>
    </div>
  );
};

export default FundFormAmountInputTypeSwitch;
