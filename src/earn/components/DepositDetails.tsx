import { getTruncatedAmount } from '@/earn/utils/getTruncatedAmount';
import { Skeleton } from '@/internal/components/Skeleton';
import { formatPercent } from '@/internal/utils/formatPercent';
import { cn, color, text, background, border } from '@/styles/theme';
import type { DepositDetailsReact } from '../types';
import { EarnDetails } from './EarnDetails';
import { useEarnContext } from './EarnProvider';
import { Popover } from '@/internal/components/Popover';
import { useRef, useState } from 'react';
import { infoSvg } from '@/internal/svg/infoSvg';

function YieldInfo() {
  const { rewards, nativeApy, vaultToken, vaultFee } = useEarnContext();
  return (
    <div
      className={cn(
        color.foregroundMuted,
        border.defaultActive,
        background.default,
        'fade-in flex min-w-52 animate-in flex-col gap-2 rounded-lg border p-3 text-sm duration-200',
      )}
    >
      {nativeApy ? (
        <div
          className="flex items-center justify-between gap-1"
          data-testid="ock-nativeApy"
        >
          <div>{vaultToken?.symbol}</div>
          <div className="font-semibold">{formatPercent(nativeApy)}</div>
        </div>
      ) : null}

      {rewards?.map((reward) => (
        <div
          key={reward.asset}
          className="flex items-center justify-between gap-1"
          data-testid="ock-rewards"
        >
          <div>{reward.assetName}</div>
          <div className="font-semibold">{formatPercent(reward.apy)}</div>
        </div>
      ))}

      {vaultFee && nativeApy ? (
        <div
          className="flex items-center justify-between gap-1"
          data-testid="ock-performanceFee"
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

function ApyTag({ apy }: { apy: number | undefined }) {
  const [isOpen, setIsOpen] = useState(true);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  return apy ? (
    <div
      ref={anchorRef}
      className={cn(
        text.label1,
        color.foregroundMuted,
        background.alternate,
        'flex items-center justify-center gap-1 rounded-full p-1 px-3',
      )}
    >
      {`APY ${formatPercent(Number(getTruncatedAmount(apy.toString(), 4)))}`}
      <button
        ref={triggerRef}
        type="button"
        data-testid="ock-apyInfoButton"
        className={cn(
          'size-3 [&_path]:fill-[var(--ock-icon-color-foreground-muted)] [&_path]:transition-colors [&_path]:ease-in-out hover:[&_path]:fill-[var(--ock-icon-color-foreground)]',
          isOpen && '[&_path]:fill-[var(--ock-icon-color-foreground)]',
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {infoSvg}
      </button>

      <Popover
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        position="bottom"
        align="end"
        trigger={triggerRef}
        anchor={anchorRef.current}
        offset={4}
      >
        <YieldInfo />
      </Popover>
    </div>
  ) : (
    <Skeleton className="!rounded-full h-7 min-w-28" />
  );
}

export function DepositDetails({ className }: DepositDetailsReact) {
  const { apy, vaultToken } = useEarnContext();

  return (
    <EarnDetails
      className={className}
      token={vaultToken}
      tag={<ApyTag apy={apy} />}
    />
  );
}
