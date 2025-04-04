'use client';
import { cn, color, text } from '../../styles/theme';
import { isSwapError } from '../../swap/utils/isSwapError';
import { useBuyContext } from './BuyProvider';

export function BuyMessage() {
  const { lifecycleStatus } = useBuyContext();

  if (isSwapError(lifecycleStatus.statusData)) {
    const message =
      lifecycleStatus.statusData.message ||
      'Something went wrong. Please try again.';

    // on missing required fields, show muted text
    const textColor =
      lifecycleStatus?.statusData?.code === 'TmBPc05'
        ? color.foregroundMuted
        : color.error;

    return <div className={cn(textColor, text.label2)}>{message}</div>;
  }

  return null;
}
