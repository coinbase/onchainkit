'use client';
import { useIsMounted } from '@/core-react/internal/hooks/useIsMounted';
import { useTheme } from '@/core-react/internal/hooks/useTheme';
import { useNFTData as defaultUseNFTData } from '@/core-react/nft/hooks/useNFTData';
import { NFTLifecycleProvider } from '@/core-react/nft/providers/NFTLifecycleProvider';
import { NFTProvider } from '@/core-react/nft/providers/NFTProvider';
import { LifecycleType, type NFTCardReact } from '@/core-react/nft/types';
import { useCallback } from 'react';
import { useAccount } from 'wagmi';
import { border, cn, color, pressable } from '../../../styles/theme';
import NFTErrorBoundary from './NFTErrorBoundary';
import { NFTErrorFallback } from './NFTErrorFallback';

export function NFTCard({
  children,
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
