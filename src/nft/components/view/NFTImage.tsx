import { useCallback, useEffect, useState } from 'react';
import { defaultNFTSvg } from '../../../internal/svg/defaultNFTSvg';
import { cn } from '../../../styles/theme';
import type { NFTError } from '../../types';
import { useNFTContext } from '../NFTProvider';

type NFTImageReact = {
  className?: string;
  onLoading?: (mediaUrl: string) => void;
  onLoaded?: () => void;
  onError?: (error: NFTError) => void;
};

export function NFTImage({
  className,
  onLoading,
  onLoaded,
  onError,
}: NFTImageReact) {
  const { imageUrl, description } = useNFTContext();
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [transitionEnded, setTransitionEnded] = useState(false);

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

  const handleRetry = useCallback(async () => {
    setError(false);
    loadImage();
  }, [loadImage]);

  const handleTransitionEnd = () => {
    setTransitionEnded(true);
  };

  return (
    <div
      className={cn(
        'relative flex h-[450px] max-h-screen items-center justify-center',
        className,
      )}
    >
      {error && (
        <div className="absolute top-[60%] z-10">
          <button type="button" onClick={handleRetry}>
            retry
          </button>
        </div>
      )}
      {!transitionEnded && (
        <div
          className={`absolute inset-0 ${loaded ? 'opacity-0' : 'opacity-100'} transition-[opacity] duration-500 ease-in-out`}
        >
          {defaultNFTSvg}
        </div>
      )}
      <img
        data-testid="ockNFTImage"
        src={imageUrl}
        alt={description}
        decoding="async"
        className={`max-h-[450px] transition-[opacity] duration-500 ease-in-out ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onTransitionEnd={handleTransitionEnd}
      />
    </div>
  );
}
