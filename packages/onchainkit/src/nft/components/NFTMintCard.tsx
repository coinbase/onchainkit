'use client';
import { useIsMounted } from '@/internal/hooks/useIsMounted';
import { useTheme } from '@/internal/hooks/useTheme';
import { NFTLifecycleProvider } from '@/nft/components/NFTLifecycleProvider';
import { NFTProvider } from '@/nft/components/NFTProvider';
import {
  NFTAssetCost,
  NFTCollectionTitle,
  NFTCreator,
  NFTMintButton,
  NFTQuantitySelector,
} from '@/nft/components/mint';
import { useMintData as defaultUseMintData } from '@/nft/hooks/useMintData';
import { LifecycleType, type NFTMintCardReact } from '@/nft/types';
import { buildMintTransactionData as defaultBuildMintTransaction } from '@/nft/utils/buildMintTransactionData';
import { background, border, cn, color } from '../../styles/theme';
import NFTErrorBoundary from './NFTErrorBoundary';
import { NFTErrorFallback } from './NFTErrorFallback';
import { NFTMedia } from './view';

function NFTMintCardDefaultContent() {
  return (
    <>
      <NFTCreator />
      <NFTMedia />
      <NFTCollectionTitle />
      <NFTQuantitySelector />
      <NFTAssetCost />
      <NFTMintButton />
    </>
  );
}

export function NFTMintCard({
  children = <NFTMintCardDefaultContent />,
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
