import { useEffect, useRef } from 'react';
import { defaultNFTSvg } from '../../../internal/svg/defaultNFTSvg';
import { cn } from '../../../styles/theme';
import type { NFTError } from '../../types';
import { useNFTContext } from '../NFTProvider';

type NFTVideoReact = {
  className?: string;
  onLoading?: (mediaUrl: string) => void;
  onLoaded?: () => void;
  onError?: (error: NFTError) => void;
};

export function NFTVideo({
  className,
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

  if (!animationUrl) {
    return <div className="max-h-350 w-350 max-w-350">{defaultNFTSvg}</div>;
  }

  return (
    <div className={cn('max-h-350 w-350 max-w-350', className)}>
      <video
        ref={videoRef}
        data-testid="ockNFTVideo"
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
