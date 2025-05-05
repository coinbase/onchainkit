'use client';
import { cn, text } from '../../styles/theme';
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
        ? 'text-ock-text-foreground-muted'
        : 'text-ock-text-error';

    return <div className={cn(textColor, text.label2)}>{message}</div>;
  }

  return null;
}
