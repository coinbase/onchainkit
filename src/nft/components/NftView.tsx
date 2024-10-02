import { background, cn } from '../../styles/theme';
import { useIsMounted } from '../../useIsMounted';
import { LifecycleType, type NftViewReact } from '../types';
import { NftLifecycleProvider } from './NftLifecycleProvider';
import { NftViewProvider } from './NftViewProvider';

export function NftView({
  children,
  className,
  contractAddress,
  tokenId,
  onStatus,
  onError,
  onSuccess,
}: NftViewReact) {
  const isMounted = useIsMounted();

  // prevents SSR hydration issue
  if (!isMounted) {
    return null;
  }

  return (
    <NftLifecycleProvider
      type={LifecycleType.VIEW}
      onStatus={onStatus}
      onError={onError}
      onSuccess={onSuccess}
    >
      <NftViewProvider contractAddress={contractAddress} tokenId={tokenId}>
        <div
          className={cn(
            background.default,
            'flex w-[500px] flex-col rounded-xl border px-6 pt-6 pb-4',
            className,
          )}
          data-testid="ockNftView_Container"
        >
          {children}
        </div>
      </NftViewProvider>
    </NftLifecycleProvider>
  );
}
