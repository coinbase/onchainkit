import { background, border, cn, color } from '../../styles/theme';
import { useIsMounted } from '../../useIsMounted';
import { useTheme } from '../../useTheme';
import { useMintData as defaultUseMintData } from '../hooks/useMintData';
import { LifecycleType, type NFTMintCardReact } from '../types';
import { buildMintTransactionData as defaultBuildMintTransaction } from '../utils/buildMintTransactionData';
import NFTErrorBoundary from './NFTErrorBoundary';
import { NFTErrorFallback } from './NFTErrorFallback';
import { NFTLifecycleProvider } from './NFTLifecycleProvider';
import { NFTProvider } from './NFTProvider';

export function NFTMintCard({
  children,
  className,
  contractAddress,
  tokenId,
  isSponsored,
  useNFTData = defaultUseMintData,
  buildMintTransaction = defaultBuildMintTransaction,
  onStatus,
  onError,
  onSuccess,
}: NFTMintCardReact) {
  const componentTheme = useTheme();

  const isMounted = useIsMounted();

  // prevents SSR hydration issue
  if (!isMounted) {
    return null;
  }

  return (
    <NFTErrorBoundary fallback={NFTErrorFallback}>
      <NFTLifecycleProvider
        type={LifecycleType.MINT}
        onStatus={onStatus}
        onError={onError}
        onSuccess={onSuccess}
      >
        <NFTProvider
          contractAddress={contractAddress}
          tokenId={tokenId}
          isSponsored={isSponsored}
          useNFTData={useNFTData}
          buildMintTransaction={buildMintTransaction}
        >
          <div
            className={cn(
              componentTheme,
              color.foreground,
              background.default,
              border.defaultActive,
              border.radius,
              'flex w-full max-w-[500px] flex-col gap-2 border p-4',
              className,
            )}
            data-testid="ockNFTMintCard_Container"
          >
            {children}
          </div>
        </NFTProvider>
      </NFTLifecycleProvider>
    </NFTErrorBoundary>
  );
}
