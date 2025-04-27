import type { NFTError } from '@/api/types';
import { useNFTContext } from '@/nft/components/NFTProvider';
import { type MouseEvent, useCallback, useEffect, useState } from 'react';
import { defaultNFTSvg } from '../../../internal/svg/defaultNFTSvg';
import { cn } from '../../../styles/theme';

type NFTImageReact = {
  className?: string;
  square?: boolean;
  onLoading?: (mediaUrl: string) => void;
  onLoaded?: () => void;
  onError?: (error: NFTError) => void;
};

export function NFTImage({
  className,
  square = true,
  onLoading,
  onLoaded,
  onError,
}: NFTImageReact) {
  const { imageUrl, description } = useNFTContext();
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const loadImage = useCallback(() => {
    if (imageUrl) {
      onLoading?.(imageUrl);

      const img = new Image();
      img.onload = () => {
        setLoaded(true);
        onLoaded?.();
      };

      img.onerror = (error: string | Event) => {
        onError?.({
          error: typeof error === 'string' ? error : error.type,
          code: 'NmNIc01', // NFT module NFTImage component 01 error
          message: 'Error loading image',
        });
        setError(true);
      };
      img.src = imageUrl;
    }
  }, [imageUrl, onLoading, onLoaded, onError]);

  useEffect(() => {
    loadImage();
  }, [loadImage]);

  const handleRetry = useCallback(
    async (e: MouseEvent) => {
      e.stopPropagation();
      setError(false);
      loadImage();
    },
    [loadImage],
  );

  return (
    <div
      className={cn(
        'grid w-full',
        '[&>*]:col-start-1 [&>*]:col-end-1 [&>*]:row-start-1 [&>*]:row-end-1',
        { 'aspect-square': square },
        className,
      )}
    >
      <div className="flex items-center justify-center">{defaultNFTSvg}</div>
      <div
        className={cn(
          'grid h-full w-full content-center justify-center overflow-hidden',
          { 'aspect-square': square },
        )}
      >
        <img
          data-testid="ockNFTImage"
          src={imageUrl}
          alt={description}
          decoding="async"
          className={cn(
            'transition-opacity duration-500 ease-in-out',
            loaded ? 'opacity-100' : 'opacity-0',
            { 'h-full w-full object-cover': square },
          )}
        />
      </div>
      {error && (
        <div className="flex items-center justify-center">
          <button type="button" onClick={handleRetry} className="z-10 mt-[60%]">
            retry
          </button>
        </div>
      )}
    </div>
  );
}
