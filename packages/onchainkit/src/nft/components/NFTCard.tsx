'use client';
import { useIsMounted } from '@/internal/hooks/useIsMounted';
import { useTheme } from '@/internal/hooks/useTheme';
import { NFTLifecycleProvider } from '@/nft/components/NFTLifecycleProvider';
import { NFTProvider } from '@/nft/components/NFTProvider';
import { useNFTData as defaultUseNFTData } from '@/nft/hooks/useNFTData';
import { LifecycleType, type NFTCardReact } from '@/nft/types';
import { useCallback } from 'react';
import { useAccount } from 'wagmi';
import { border, cn, color, pressable } from '../../styles/theme';
import NFTErrorBoundary from './NFTErrorBoundary';
import { NFTErrorFallback } from './NFTErrorFallback';
import {
  NFTLastSoldPrice,
  NFTMedia,
  NFTNetwork,
  NFTOwner,
  NFTTitle,
} from './view';

function NFTCardDefaultContent() {
  return (
    <>
      <NFTMedia />
      <NFTTitle />
      <NFTOwner />
      <NFTLastSoldPrice />
      <NFTNetwork />
    </>
  );
}

export function NFTCard({
  children = <NFTCardDefaultContent />,
  className,
  contractAddress,
  tokenId,
  useNFTData = defaultUseNFTData,
  onStatus,
  onError,
  onSuccess,
}: NFTCardReact) {
  const componentTheme = useTheme();

  const isMounted = useIsMounted();

  const { chain } = useAccount();

  const handleOnClick = useCallback(() => {
    const network = chain?.name.toLowerCase() ?? 'base';
    const zoraUrl = `https://zora.co/collect/${network}:${contractAddress}/${tokenId}`;
    window.open(zoraUrl, '_blank', 'noopener,noreferrer');
  }, [chain, contractAddress, tokenId]);

  // prevents SSR hydration issue
  if (!isMounted) {
    return null;
  }

  return (
    <NFTErrorBoundary fallback={NFTErrorFallback}>
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
          <button
            type="button"
            className={cn(
              componentTheme,
              color.foreground,
              pressable.default,
              border.radius,
              'flex w-full max-w-[500px] flex-col items-stretch gap-1.5 border p-4 text-left',
              `hover:border-[${border.defaultActive}]`,
              className,
            )}
            data-testid="ockNFTCard_Container"
            onClick={handleOnClick}
          >
            {children}
          </button>
        </NFTProvider>
      </NFTLifecycleProvider>
    </NFTErrorBoundary>
  );
}
