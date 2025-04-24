import { useIsMounted } from '../../internal/hooks/useIsMounted';
import { useTheme } from '../../internal/hooks/useTheme';
import { cn } from '../../styles/theme';
import { useOnchainKit } from '../../useOnchainKit';
import type { TransactionReact } from '../types';
import { TransactionButton } from './TransactionButton';
import { TransactionProvider } from './TransactionProvider';
import { TransactionToast } from './TransactionToast';

export function Transaction({
  calls,
  capabilities,
  chainId,
  className,
  children,
  contracts,
  disabled = false,
  isSponsored,
  onError,
  onStatus,
  onSuccess,
  resetAfter,
}: TransactionReact) {
  const isMounted = useIsMounted();
  const componentTheme = useTheme();
  const { chain } = useOnchainKit();

  // prevents SSR hydration issue
  if (!isMounted) {
    return (
      <div
        className={cn(componentTheme, 'flex w-full flex-col gap-2', className)}
      />
    );
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
      resetAfter={resetAfter}
    >
      <div
        className={cn(componentTheme, 'flex w-full flex-col gap-2', className)}
      >
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
