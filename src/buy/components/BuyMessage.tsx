import { cn, color } from '../../styles/theme';
import { isSwapError } from '../../swap/utils/isSwapError';
import { useBuyContext } from './BuyProvider';

export function BuyMessage() {
  const { lifecycleStatus } = useBuyContext();

  // Missing required fields
  if (
    isSwapError(lifecycleStatus.statusData) &&
    lifecycleStatus?.statusData?.code === 'TmBPc05'
  ) {
    return (
      <div className={cn('text-sm', color.foregroundMuted)}>
        Complete the field to continue
      </div>
    );
  }

  if (lifecycleStatus?.statusName === 'error') {
    return (
      <div className={cn(color.error, 'text-sm')}>
        Something went wrong. Please try again.
      </div>
    );
  }

  return null;
}
