import { cn, color } from '../../styles/theme';
import { useBuyContext } from './BuyProvider';

export function BuyMessage() {
  const {
    lifecycleStatus: { statusName },
  } = useBuyContext();

  if (statusName !== 'error') {
    return null;
  }

  return (
    <div className={cn(color.error, 'text-sm')}>
      Something went wrong. Please try again.
    </div>
  );
}
