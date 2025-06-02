'use client';
import { useEarnContext } from '@/earn/components/EarnProvider';
import { getTruncatedAmount } from '@/earn/utils/getTruncatedAmount';
import { Popover } from '@/internal/components/Popover';
import { Skeleton } from '@/internal/components/Skeleton';
import { infoSvg } from '@/internal/svg/infoSvg';
import { formatPercent } from '@/internal/utils/formatPercent';
import { cn, text } from '@/styles/theme';
import { PopoverTrigger } from '@radix-ui/react-popover';
import { useState } from 'react';

function YieldInfo() {
  const { rewards, nativeApy, vaultToken, vaultFee } = useEarnContext();
  return (
    <div
      className={cn(
        'text-ock-text-foreground-muted',
        'border-ock-bg-default-active',
        'bg-ock-bg-default',
        'fade-in flex min-w-52 animate-in flex-col gap-2 rounded-lg border p-3 text-sm duration-200',
      )}
    >
      {nativeApy ? (
        <div
          className="flex items-center justify-between gap-1"
          data-testid="ock-earnNativeApy"
        >
          <div>{vaultToken?.symbol}</div>
          <div className="font-semibold">{formatPercent(nativeApy)}</div>
        </div>
      ) : null}

      {rewards?.map((reward) => (
        <div
          key={reward.asset}
          className="flex items-center justify-between gap-1"
          data-testid="ock-earnRewards"
        >
          <div>{reward.assetName}</div>
          <div className="font-semibold">{formatPercent(reward.apy)}</div>
        </div>
      ))}

      {vaultFee && nativeApy ? (
        <div
          className="flex items-center justify-between gap-1"
          data-testid="ock-earnPerformanceFee"
        >
          <div>
            Perf. Fee{' '}
            <span className="text-xs">({formatPercent(vaultFee, 0)})</span>
          </div>
          <div className="font-semibold">
            -{formatPercent(vaultFee * nativeApy)}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function YieldDetails() {
  const [isOpen, setIsOpen] = useState(false);

  const { apy } = useEarnContext();

  if (!apy) {
    return <Skeleton className="!rounded-full h-7 min-w-28" />;
  }

  return (
    <Popover
      open={isOpen}
      onOpenChange={setIsOpen}
      side="bottom"
      align="end"
      sideOffset={4}
      anchor={
        <div
          className={cn(
            text.label1,
            'text-ock-text-foreground-muted',
            'bg-ock-bg-alternate',
            'flex items-center justify-center gap-1 rounded-full p-1 px-3',
          )}
          data-testid="ock-yieldDetails"
        >
          {`APY ${formatPercent(Number(getTruncatedAmount(apy.toString(), 4)))}`}
          <PopoverTrigger asChild>
            <button
              type="button"
              data-testid="ock-apyInfoButton"
              className={cn(
                'size-3 [&_path]:fill-ock-icon-color-foreground-muted [&_path]:transition-colors [&_path]:ease-in-out [&_path]:hover:fill-ock-icon-color-foreground',
                isOpen && '[&_path]:fill-ock-icon-color-foreground',
              )}
              onClick={() => setIsOpen(!isOpen)}
            >
              {infoSvg}
            </button>
          </PopoverTrigger>
        </div>
      }
    >
      <YieldInfo />
    </Popover>
  );
}
