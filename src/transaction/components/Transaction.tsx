import { TransactionProvider } from './TransactionProvider';
import { cn } from '../../styles/theme';
import type { TransactionReact } from '../types';

export function Transaction({
  address,
  className,
  children,
  contracts,
}: TransactionReact) {
  return (
    <TransactionProvider address={address} contracts={contracts}>
      <div className={cn(className, 'flex w-full flex-col gap-2')}>
        {children}
      </div>
    </TransactionProvider>
  );
}
