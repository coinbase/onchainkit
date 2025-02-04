import { getTruncatedAmount } from '@/earn/utils/getTruncatedAmount';
import type { DepositDetailsReact } from '../types';
import { EarnDetails } from './EarnDetails';
import { useEarnContext } from './EarnProvider';
import { background } from '@/styles/theme';
import { color } from '@/styles/theme';
import { text } from '@/styles/theme';
import { cn } from '@/styles/theme';
import { Skeleton } from '@/internal/components/Skeleton';
import { getTokenFromAddress } from '@/earn/utils/getTokenFromAddress';
import { formatPercent } from '@/internal/utils/formatPercent';

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
  const { apy, assetAddress } = useEarnContext();
  console.log('assetAddress:', assetAddress);
  console.log('apy:', apy);

  const token = assetAddress ? getTokenFromAddress(assetAddress) : undefined;

  // TODO: update token when we have logic to fetch vault info
  return (
    <EarnDetails
      className={className}
      token={token}
      tag={<ApyTag apy={apy} />}
      tagVariant="default"
    />
  );
}
