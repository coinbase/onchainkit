import { useIsMounted } from '@/core-react/internal/hooks/useIsMounted';
import { useTheme } from '@/core-react/internal/hooks/useTheme';
import { useMintData as defaultUseMintData } from '@/core-react/nft/hooks/useMintData';
import { NFTLifecycleProvider } from '@/core-react/nft/providers/NFTLifecycleProvider';
import { NFTProvider } from '@/core-react/nft/providers/NFTProvider';
import {
  LifecycleType,
  type NFTMintCardReact,
} from '@/core-react/nft/types';
import { buildMintTransactionData as defaultBuildMintTransaction } from '@/core/nft/utils/buildMintTransactionData';
import { background, border, cn, color } from '../../../styles/theme';
import NFTErrorBoundary from './NFTErrorBoundary';
import { NFTErrorFallback } from './NFTErrorFallback';

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
