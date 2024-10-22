import { useEffect, useRef } from 'react';
import { defaultNftSvg } from '../../../internal/svg/defaultNftSvg';
import { cn } from '../../../styles/theme';
import type { NftError } from '../../types';
import { useNftContext } from '../NftProvider';

type NftVideoReact = {
  className?: string;
  onLoading?: (mediaUrl: string) => void;
  onLoaded?: () => void;
  onError?: (error: NftError) => void;
};

export function NftVideo({
  className,
  onLoading,
  onLoaded,
  onError,
}: NftVideoReact) {
  const { animationUrl, imageUrl } = useNftContext();
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
          code: 'NmNVc01', // Nft module NftVideo component 01 error
          message: 'Error loading video',
        });
      };
    }
  }, [animationUrl, onLoading, onLoaded, onError]);

  if (!animationUrl) {
    return <div className="max-h-350 w-350 max-w-350">{defaultNftSvg}</div>;
  }

  return (
    <div className={cn('max-h-350 w-350 max-w-350', className)}>
      <video
        ref={videoRef}
        data-testid="ockNftVideo"
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
