import { cn, color } from '../../styles/theme';
import { useFundSwapContext } from './FundSwapProvider';

export function FundSwapMessage() {
  const {
    lifecycleStatus: { statusName },
  } = useFundSwapContext();

  if (statusName !== 'error') {
    return null;
  }

  return (
    <div className={cn(color.error, 'text-sm')}>
      Something went wrong. Please try again.
    </div>
  );
}
