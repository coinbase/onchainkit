import { getTruncatedAmount } from '@/earn/utils/getTruncatedAmount';
import { usdcToken } from '@/token/constants';
import type { DepositDetailsReact } from '../types';
import { EarnDetails } from './EarnDetails';
import { useEarnContext } from './EarnProvider';
import { background } from '@/styles/theme';
import { color } from '@/styles/theme';
import { text } from '@/styles/theme';
import { cn } from '@/styles/theme';
import { Skeleton } from '@/internal/components/Skeleton';

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
      {`APY ${getTruncatedAmount(apy.toString(), 3)}%`}
    </div>
  ) : (
    <Skeleton className="!rounded-full h-7 min-w-28" />
  );
}

export function DepositDetails({ className }: DepositDetailsReact) {
  const { apy } = useEarnContext();

  // TODO: update token when we have logic to fetch vault info
  return (
    <EarnDetails
      className={className}
      token={usdcToken}
      tag={<ApyTag apy={apy} />}
      tagVariant="default"
    />
  );
}
