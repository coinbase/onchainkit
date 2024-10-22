import { background, border, cn, color } from '../../styles/theme';
import { useIsMounted } from '../../useIsMounted';
import { useTheme } from '../../useTheme';
import { LifecycleType, type NFTMintReact } from '../types';
import { NFTLifecycleProvider } from './NFTLifecycleProvider';
import { NFTMintProvider } from './NFTMintProvider';
import { NFTProvider } from './NFTProvider';

export function NFTMint({
  children,
  className,
  contractAddress,
  tokenId,
  useNFTData,
  useNFTMintData,
  buildMintTransaction,
  onStatus,
  onError,
  onSuccess,
}: NFTMintReact) {
  const componentTheme = useTheme();

  const isMounted = useIsMounted();

  // prevents SSR hydration issue
  if (!isMounted) {
    return null;
  }

  return (
    <NFTLifecycleProvider
      type={LifecycleType.MINT}
      onStatus={onStatus}
      onError={onError}
      onSuccess={onSuccess}
    >
      <NFTProvider
        contractAddress={contractAddress}
        tokenId={tokenId}
        useNFTData={useNFTData}
      >
        <NFTMintProvider
          useNFTMintData={useNFTMintData}
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
            data-testid="ockNFTMint_Container"
          >
            {children}
          </div>
        </NFTMintProvider>
      </NFTProvider>
    </NFTLifecycleProvider>
  );
}
