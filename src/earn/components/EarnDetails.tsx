import { VaultDetails } from '@/earn/components/VaultDetails';
import { YieldDetails } from '@/earn/components/YieldDetails';
import { border, cn } from '@/styles/theme';
import type { EarnDetailsReact } from '../types';

export function EarnDetails({ className }: EarnDetailsReact) {
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
