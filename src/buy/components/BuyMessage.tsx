import { cn, color } from '../../styles/theme';
import { useBuyContext } from './BuyProvider';

export function BuyMessage() {
  const {
    lifecycleStatus: { statusName, statusData },
  } = useBuyContext();

  // Missing required fields
  if (statusName === 'error' && statusData?.code === 'TmBPc05') {
    return (
      <div className={cn('text-sm', color.foregroundMuted)}>
        Complete the field to continue
      </div>
    );
  }

  if (statusName === 'error') {
    return (
      <div className={cn(color.error, 'text-sm')}>
        Something went wrong. Please try again.
      </div>
    );
  }

  return null;
}
