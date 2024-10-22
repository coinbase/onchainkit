import { useCallback, useEffect, useState } from 'react';
import { defaultNftSvg } from '../../../internal/svg/defaultNftSvg';
import { cn } from '../../../styles/theme';
import type { NftError } from '../../types';
import { useNftContext } from '../NftProvider';

type NftImageReact = {
  className?: string;
  onLoading?: (mediaUrl: string) => void;
  onLoaded?: () => void;
  onError?: (error: NftError) => void;
};

export function NftImage({
  className,
  onLoading,
  onLoaded,
  onError,
}: NftImageReact) {
  const { imageUrl, description } = useNftContext();
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
          code: 'NmNIc01', // Nft module NftImage component 01 error
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
          {defaultNftSvg}
        </div>
      )}
      <img
        data-testid="ockNftImage"
        src={imageUrl}
        alt={description}
        decoding="async"
        className={`max-h-[450px] transition-[opacity] duration-500 ease-in-out ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onTransitionEnd={handleTransitionEnd}
      />
    </div>
  );
}
