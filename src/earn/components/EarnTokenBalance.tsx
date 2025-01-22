import { background, border, cn, color, text } from '@/styles/theme';
import { usdcToken } from '@/token/constants';
import { useGetTokenBalance } from '@/wallet/hooks/useGetTokenBalance';
import { useCallback } from 'react';
import { useAccount } from 'wagmi';
import { EarnTokenBalanceParams } from '../types';
import { useEarnContext } from './EarnProvider';

export function EarnTokenBalance({ className }: EarnTokenBalanceParams) {
  const { address } = useAccount();
  const { setDepositAmount } = useEarnContext();
  const { convertedBalance } = useGetTokenBalance(address, usdcToken);

  const handleUseMaxPress = useCallback(() => {
    if (convertedBalance) {
      setDepositAmount(convertedBalance);
    }
  }, [convertedBalance, setDepositAmount]);

  return (
    <div
      className={cn(
        background.alternate,
        border.radius,
        'flex p-3 px-4 items-center gap-4 justify-between',
        className,
      )}
    >
      <div className={cn('flex flex-col', color.foreground)}>
        <div
          className={text.headline}
        >{`${convertedBalance} ${usdcToken.symbol}`}</div>
        <div className={cn(text.label2, color.foregroundMuted)}>
          Available to deposit
        </div>
      </div>
      {convertedBalance && (
        <div
          onClick={handleUseMaxPress}
          className={cn(text.label2, color.primary)}
        >
          Use max
        </div>
      )}
    </div>
  );
}
