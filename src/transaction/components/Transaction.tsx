import { cn } from '../../styles/theme';
import { useIsMounted } from '../../useIsMounted';
import { useOnchainKit } from '../../useOnchainKit';
import { useTheme } from '../../useTheme';
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
  onResetState,
  onStatus,
  onSuccess,
  resetOnComplete,
}: TransactionReact) {
  const isMounted = useIsMounted();
  const componentTheme = useTheme();
  const { chain } = useOnchainKit();

  // prevents SSR hydration issue
  if (!isMounted) {
    return null;
  }

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
      onResetState={onResetState}
      onStatus={onStatus}
      onSuccess={onSuccess}
      resetOnComplete={resetOnComplete}
    >
      <div
        className={cn(componentTheme, 'flex w-full flex-col gap-2', className)}
      >
        {children}
      </div>
    </TransactionProvider>
  );
}
