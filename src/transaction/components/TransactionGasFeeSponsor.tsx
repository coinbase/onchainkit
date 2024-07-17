import { cn, color, text } from '../../styles/theme';
import type { TransactionGasFeeSponsorReact } from '../types';

export function TransactionGasFeeSponsor({
  className,
}: TransactionGasFeeSponsorReact) {
  // TODO: replace with actual value
  const sponsoredBy = 'Coinbase';

  return (
    <div className={cn(text.label2, 'pl-2', className)}>
      <p className={color.foregroundMuted}>
        •{'  '}Sponsored by{' '}
        <span className={cn(text.label1, color.primary)}>{sponsoredBy}</span>
      </p>
    </div>
  );
}
