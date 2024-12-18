import { useIsMounted } from '@/core-react/internal/hooks/useIsMounted';
import { useTheme } from '@/core-react/internal/hooks/useTheme';
import { useOnchainKit } from '@/core-react/useOnchainKit';
import { cn } from '@/styles/theme';
import type { TransactionReact } from '@/core-react/transaction/types';
import { TransactionProvider } from '@/core-react/transaction/providers/TransactionProvider';

export function Transaction({
  calls,
  capabilities,
  chainId,
  className,
  children,
  contracts,
  isSponsored,
  onError,
  onStatus,
  onSuccess,
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
      isSponsored={isSponsored}
      onError={onError}
      onStatus={onStatus}
      onSuccess={onSuccess}
    >
      <div
        className={cn(componentTheme, 'flex w-full flex-col gap-2', className)}
      >
        {children}
      </div>
    </TransactionProvider>
  );
}
