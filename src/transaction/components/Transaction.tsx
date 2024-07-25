import { cn } from '../../styles/theme';
import type { TransactionReact } from '../types';
import { TransactionProvider } from './TransactionProvider';

export function Transaction({
  address,
  className,
  children,
  contracts,
  chainId,
  capabilities,
  onError,
}: TransactionReact) {
  return (
    <TransactionProvider
      address={address}
      contracts={contracts}
      chainId={chainId}
      capabilities={capabilities}
      onError={onError}
    >
      <div className={cn(className, 'flex w-full flex-col gap-2')}>
        {children}
      </div>
    </TransactionProvider>
  );
}
