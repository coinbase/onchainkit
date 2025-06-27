import { useIsMounted } from '../../internal/hooks/useIsMounted';
import { cn } from '../../styles/theme';
import { useOnchainKit } from '../../onchainkit/hooks/useOnchainKit';
import type { TransactionProps } from '../types';
import { TransactionButton } from './TransactionButton';
import { TransactionProvider } from './TransactionProvider';
import { TransactionToast } from './TransactionToast';

export function Transaction({
  calls,
  capabilities,
  chainId,
  className,
  children,
  disabled = false,
  isSponsored,
  onError,
  onStatus,
  onSuccess,
  resetAfter,
}: TransactionProps) {
  const isMounted = useIsMounted();
  const { chain } = useOnchainKit();

  // prevents SSR hydration issue
  if (!isMounted) {
    return <div className={cn('flex w-full flex-col gap-2', className)} />;
  }

  // If chainId is not provided,
  // use the default chainId from the OnchainKit context
  const accountChainId = chainId ? chainId : chain.id;

  return (
    <TransactionProvider
      calls={calls}
      capabilities={capabilities}
      chainId={accountChainId}
      isSponsored={isSponsored}
      onError={onError}
      onStatus={onStatus}
      onSuccess={onSuccess}
      resetAfter={resetAfter}
    >
      <div className={cn('flex w-full flex-col gap-2', className)}>
        {children ?? (
          <>
            <TransactionButton disabled={disabled} />
            <TransactionToast />
          </>
        )}
      </div>
    </TransactionProvider>
  );
}
