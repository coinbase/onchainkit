import { cn, color } from '../../styles/theme';
import { useSwapLiteContext } from './SwapLiteProvider';

export function SwapLiteMessage() {
  const {
    lifecycleStatus: { statusName },
  } = useSwapLiteContext();

  if (statusName !== 'error') {
    return null;
  }

  return (
    <div className={cn(color.error, 'text-sm')}>
      Something went wrong. Please try again.
    </div>
  );
}
