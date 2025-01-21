import { background, border, cn, color, text } from '@/styles/theme';
import { usdcToken } from '@/token/constants';
import { useGetTokenBalance } from '@/wallet/hooks/useGetTokenBalance';
import { useCallback } from 'react';
import { useAccount } from 'wagmi';
import { EarnTokenBalanceParams } from '../types';

export function EarnTokenBalance({ className }: EarnTokenBalanceParams) {
  const { address } = useAccount();
  const data = useGetTokenBalance(address, usdcToken);

  const handleUseMax = useCallback(() => {
    // TODO: Implement use max
  }, []);

  return (
    <div
      className={cn(
        background.alternate,
        border.radius,
        'flex p-3 items-center gap-4',
        className,
      )}
    >
      <div className={cn('flex flex-col', color.foreground)}>
        <div
          className={text.headline}
        >{`${data.roundedBalance} ${usdcToken.symbol}`}</div>
        <div className={cn(text.label2, color.foregroundMuted)}>
          Available to deposit
        </div>
      </div>
      <div onClick={handleUseMax} className={cn(text.label2, color.primary)}>
        Use max
      </div>
    </div>
  );
}
