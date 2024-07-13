import { cn, color, text } from '../../styles/theme';
import type { TransactionGasFeeLabelReact } from '../types';

export function TransactionGasFeeLabel({
  className,
}: TransactionGasFeeLabelReact) {
  return (
    <div className={cn(text.label2, className)}>
      <p className={color.foregroundMuted}>Gas fee</p>
    </div>
  );
}
