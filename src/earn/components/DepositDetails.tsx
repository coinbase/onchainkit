import { getTruncatedAmount } from '@/earn/utils/getTruncatedAmount';
import { Skeleton } from '@/internal/components/Skeleton';
import { formatPercent } from '@/internal/utils/formatPercent';
import { background } from '@/styles/theme';
import { color } from '@/styles/theme';
import { text } from '@/styles/theme';
import { cn } from '@/styles/theme';
import type { DepositDetailsReact } from '../types';
import { EarnDetails } from './EarnDetails';
import { useEarnContext } from './EarnProvider';

function ApyTag({ apy }: { apy: number | undefined }) {
  return apy ? (
    <div
      className={cn(
        text.label1,
        color.foregroundMuted,
        background.alternate,
        'flex items-center justify-center rounded-full p-1 px-3',
      )}
    >
      {`APY ${formatPercent(Number(getTruncatedAmount(apy.toString(), 3)))}`}
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
