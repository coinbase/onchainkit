import { cn, color, text } from '../../styles/theme';
import { useTransactionContext } from './TransactionProvider';
import type { TransactionGasFeeEstimateReact } from '../types';

export function TransactionGasFeeEstimate({
  className,
}: TransactionGasFeeEstimateReact) {
  const { gasFee } = useTransactionContext();

  return (
    <div className={cn(text.label2, 'ml-auto', className)}>
      {gasFee && <p className={color.foregroundMuted}>{`${gasFee} ETH`}</p>}
    </div>
  );
}
