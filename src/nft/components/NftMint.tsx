import { background, border, cn, color } from '../../styles/theme';
import { useIsMounted } from '../../useIsMounted';
import { LifecycleType, type NftMintReact } from '../types';
import { NftProvider } from './NftProvider';
import { NftMintProvider } from './NftMintProvider';
import { NftLifecycleProvider } from './NftLifecycleProvider';
import { useTheme } from '../../useTheme';

export function NftMint({
  children,
  className,
  contractAddress,
  tokenId = '1',
  useNftData,
  useNftMintData,
  onStatus,
  onError,
  onSuccess,
}: NftMintReact) {
  const componentTheme = useTheme();

  const isMounted = useIsMounted();

  // prevents SSR hydration issue
  if (!isMounted) {
    return null;
  }

  return (
    <NftLifecycleProvider
      type={LifecycleType.MINT}
      onStatus={onStatus}
      onError={onError}
      onSuccess={onSuccess}
    >
      <NftProvider
        contractAddress={contractAddress}
        tokenId={tokenId}
        useNftData={useNftData}
      >
        <NftMintProvider useNftMintData={useNftMintData}>
          <div
            className={cn(
              componentTheme,
              color.foreground,
              background.default,
              border.defaultActive,
              border.radius,
              'flex max-w-[500px] w-full flex-col border px-6 py-4',
              className,
            )}
            data-testid="ockNftMint_Container"
          >
            {children}
          </div>
        </NftMintProvider>
      </NftProvider>
    </NftLifecycleProvider>
  );
}
