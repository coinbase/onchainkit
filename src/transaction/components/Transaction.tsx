import { TransactionProvider } from './TransactionProvider';
import type { TransactionReact } from '../types';

export function Transaction({
  address,
  className,
  children,
  contracts,
}: TransactionReact) {
  return (
    <TransactionProvider address={address} contracts={contracts}>
      <div className={className}>{children}</div>
    </TransactionProvider>
  );
}
