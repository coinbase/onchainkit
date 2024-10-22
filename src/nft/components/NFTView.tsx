import { background, border, cn, color } from '../../styles/theme';
import { useIsMounted } from '../../useIsMounted';
import { useTheme } from '../../useTheme';
import { LifecycleType, type NFTViewReact } from '../types';
import { NFTLifecycleProvider } from './NFTLifecycleProvider';
import { NFTProvider } from './NFTProvider';

export function NFTView({
  children,
  className,
  contractAddress,
  tokenId,
  useNFTData,
  onStatus,
  onError,
  onSuccess,
}: NFTViewReact) {
  const componentTheme = useTheme();

  const isMounted = useIsMounted();

  // prevents SSR hydration issue
  if (!isMounted) {
    return null;
  }

  return (
    <NFTLifecycleProvider
      type={LifecycleType.VIEW}
      onStatus={onStatus}
      onError={onError}
      onSuccess={onSuccess}
    >
      <NFTProvider
        contractAddress={contractAddress}
        tokenId={tokenId}
        useNFTData={useNFTData}
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
          data-testid="ockNFTView_Container"
        >
          {children}
        </div>
      </NFTProvider>
    </NFTLifecycleProvider>
  );
}
