import { background, border, cn, color, text } from '@/styles/theme';
import { usdcToken } from '@/token/constants';
import { useGetTokenBalance } from '@/wallet/hooks/useGetTokenBalance';
import { useCallback } from 'react';
import { useAccount } from 'wagmi';
import { EarnDepositDetailsParams } from '../types';
import { TokenChip } from '@/token';

const APY = '6.47%';

export function EarnDepositDetails({ className }: EarnDepositDetailsParams) {
  return (
    <div
      className={cn(
        border.radius,
        'flex items-center gap-4 w-full justify-between',
        className,
      )}
    >
      <TokenChip
        className={'!bg-[transparent]'}
        token={usdcToken}
        isPressable={false}
      />
      <div
        className={cn(
          text.label1,
          color.foregroundMuted,
          background.alternate,
          'p-1 px-2 rounded-full',
        )}
      >
        {`APY ${APY}`}
      </div>
    </div>
  );
}
