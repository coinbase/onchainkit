import { cn, color, text } from '../../styles/theme';
import type { TransactionSponsorReact } from '../types';
import { useTransactionContext } from './TransactionProvider';

export function TransactionSponsor({
  className,
  text: sponsorName,
}: TransactionSponsorReact) {
  const { hasPaymaster, statusWriteContract, statusWriteContracts } =
    useTransactionContext();
  if (
    statusWriteContract !== 'idle' ||
    statusWriteContracts !== 'idle' ||
    !hasPaymaster
  ) {
    return null;
  }

  return (
    <div className={cn(text.label2, 'flex', className)}>
      <p className={color.foregroundMuted}>Free gas</p>
      {!!sponsorName && (
        <div className="flex">
          <p className={cn(color.foregroundMuted, 'pl-2')}>•</p>
          <p className={cn(color.foregroundMuted, 'pl-2')}>
            Sponsored by{' '}
            <span className={cn(text.label1, color.primary)}>
              {sponsorName}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
