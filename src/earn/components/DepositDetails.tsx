import { getTruncatedAmount } from '@/earn/utils/getTruncatedAmount';
import { Skeleton } from '@/internal/components/Skeleton';
import { formatPercent } from '@/internal/utils/formatPercent';
import { background } from '@/styles/theme';
import { cn, color, text } from '@/styles/theme';
import type { DepositDetailsReact } from '../types';
import { EarnDetails } from './EarnDetails';
import { useEarnContext } from './EarnProvider';
import { Popover } from '@/internal/components/Popover';
import { useRef, useState } from 'react';
import { infoSvg } from '@/internal/svg/infoSvg';

function YieldInfo() {
  return (
    <div>
      <div>Yield Info</div>
    </div>
  );
}

function ApyTag({ apy }: { apy: number | undefined }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return apy ? (
    <div
      className={cn(
        text.label1,
        color.foregroundMuted,
        background.alternate,
        'flex items-center justify-center gap-1 rounded-full p-1 px-3',
      )}
    >
      {`APY ${formatPercent(Number(getTruncatedAmount(apy.toString(), 3)))}`}
      <button
        ref={triggerRef}
        type="button"
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
        anchor={triggerRef.current}
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
