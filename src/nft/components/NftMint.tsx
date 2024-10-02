import { background, border, cn, color } from '../../styles/theme';
import { useIsMounted } from '../../useIsMounted';
import { useTheme } from '../../useTheme';
import { LifecycleType, type NftMintReact } from '../types';
import { NftLifecycleProvider } from './NftLifecycleProvider';
import { NftMintProvider } from './NftMintProvider';
import { NftProvider } from './NftProvider';

export function NftMint({
  children,
  className,
  contractAddress,
  tokenId = '1',
  useNftData,
  useNftMintData,
  buildMintTransaction,
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
        <NftMintProvider
          useNftMintData={useNftMintData}
          buildMintTransaction={buildMintTransaction}
        >
          <div
            className={cn(
              componentTheme,
              color.foreground,
              background.default,
              border.defaultActive,
              border.radius,
              'flex w-full max-w-[500px] flex-col border px-6 py-4',
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
