import { background, cn } from '../../styles/theme';
import { useIsMounted } from '../../useIsMounted';
import { LifecycleType, type NftViewReact } from '../types';
import { NftLifecycleProvider } from './NftLifecycleProvider';
import { NftProvider } from './NftProvider';
import { useNftData as defaultUseNftData } from '../hooks/useNftData';

export function NftView({
  children,
  className,
  contractAddress,
  tokenId,
  useNftData = defaultUseNftData,
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
      <NftProvider contractAddress={contractAddress} tokenId={tokenId} useNftData={useNftData}>
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
      </NftProvider>
    </NftLifecycleProvider>
  );
}
