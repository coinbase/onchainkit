import { background, border, cn, color } from '../../styles/theme';
import { useIsMounted } from '../../useIsMounted';
import { useTheme } from '../../useTheme';
import { LifecycleType, type NftViewReact } from '../types';
import { NftLifecycleProvider } from './NftLifecycleProvider';
import { NftProvider } from './NftProvider';

export function NftView({
  children,
  className,
  contractAddress,
  tokenId,
  useNftData,
  onStatus,
  onError,
  onSuccess,
}: NftViewReact) {
  const componentTheme = useTheme();

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
      <NftProvider
        contractAddress={contractAddress}
        tokenId={tokenId}
        useNftData={useNftData}
      >
        <div
          className={cn(
            componentTheme,
            color.foreground,
            background.default,
            border.defaultActive,
            border.radius,
            'flex w-full max-w-[500px] flex-col border px-6 pt-6 pb-4',
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
