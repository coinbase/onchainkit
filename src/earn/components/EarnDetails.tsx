'use client';
import { useEarnContext } from '@/earn/components/EarnProvider';
import { VaultDetails } from '@/earn/components/VaultDetails';
import { YieldDetails } from '@/earn/components/YieldDetails';
import { border, cn, color } from '@/styles/theme';
import type { EarnDetailsReact } from '../types';

export function EarnDetails({ className }: EarnDetailsReact) {
  const { error } = useEarnContext();

  if (error) {
    return (
      <div className={cn('flex w-full flex-col gap-1 text-sm', color.error)}>
        <div className="font-semibold">Error fetching vault details</div>
        <div className="text-xs">{error.message}</div>
      </div>
    );
  }

  return (
    <div
      data-testid="ockEarnDetails"
      className={cn(
        border.radius,
        'flex w-full items-center justify-between gap-4',
        className,
      )}
    >
      <VaultDetails />
      <YieldDetails />
    </div>
  );
}
