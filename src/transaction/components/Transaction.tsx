import { cn } from '../../styles/theme';
import { useIsMounted } from '../../useIsMounted';
import { useOnchainKit } from '../../useOnchainKit';
import type { TransactionReact } from '../types';
import { TransactionProvider } from './TransactionProvider';

export function Transaction({
  calls,
  capabilities,
  chainId,
  className,
  children,
  contracts,
  onError,
  onStatus,
  onSuccess,
}: TransactionReact) {
  const isMounted = useIsMounted();
  // prevents SSR hydration issue
  if (!isMounted) {
    return null;
  }
  const { chain } = useOnchainKit();
  // If chainId is not provided,
  // use the default chainId from the OnchainKit context
  const accountChainId = chainId ? chainId : chain.id;

  return (
    <TransactionProvider
      calls={calls}
      capabilities={capabilities}
      chainId={accountChainId}
      contracts={contracts}
      onError={onError}
      onStatus={onStatus}
      onSuccess={onSuccess}
    >
      <div className={cn(className, 'flex w-full flex-col gap-2')}>
        {children}
      </div>
    </TransactionProvider>
  );
}
