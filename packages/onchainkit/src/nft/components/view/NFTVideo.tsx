import type { NFTError } from '@/api/types';
import { useNFTContext } from '@/nft/components/NFTProvider';
import { useCallback, useEffect, useRef } from 'react';
import { defaultNFTSvg } from '../../../internal/svg/defaultNFTSvg';
import { cn } from '../../../styles/theme';

type NFTVideoReact = {
  className?: string;
  square?: boolean;
  onLoading?: (mediaUrl: string) => void;
  onLoaded?: () => void;
  onError?: (error: NFTError) => void;
};

export function NFTVideo({
  className,
  square = true,
  onLoading,
  onLoaded,
  onError,
}: NFTVideoReact) {
  const { animationUrl, imageUrl } = useNFTContext();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (animationUrl && videoRef?.current) {
      videoRef.current.onloadstart = () => {
        onLoading?.(animationUrl);
      };

      videoRef.current.onloadeddata = () => {
        onLoaded?.();
      };

      videoRef.current.onerror = (error: string | Event) => {
        onError?.({
          error: typeof error === 'string' ? error : error.type,
          code: 'NmNVc01', // NFT module NFTVideo component 01 error
          message: 'Error loading video',
        });
      };
    }
  }, [animationUrl, onLoading, onLoaded, onError]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLVideoElement>) => {
    e.stopPropagation();
  }, []);

  if (!animationUrl) {
    return <div className="max-h-350 w-350 max-w-350">{defaultNFTSvg}</div>;
  }

  return (
    <div
      className={cn(
        'grid w-full',
        '[&>*]:col-start-1 [&>*]:col-end-1 [&>*]:row-start-1 [&>*]:row-end-1',
        { 'content-center justify-center': !square },
        { 'aspect-square': square },
        className,
      )}
    >
      <video
        ref={videoRef}
        data-testid="ockNFTVideo"
        onClick={handleClick}
        className={cn({ 'h-full w-full object-cover aspect-square': square })}
        poster={imageUrl}
        controls={true}
        loop={true}
        src={animationUrl}
        muted={true}
        autoPlay={true}
        playsInline={true}
        draggable={false}
        width="100%"
      />
    </div>
  );
}
