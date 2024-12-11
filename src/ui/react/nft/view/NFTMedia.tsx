import { useCallback, useMemo } from 'react';
import { useNFTLifecycleContext } from '../../../../core-react/nft/providers/NFTLifecycleProvider';
import { useNFTContext } from '../../../../core-react/nft/providers/NFTProvider';
import {
  LifecycleType,
  MediaType,
  type NFTError,
} from '../../../../core-react/nft/types';
import { cn } from '../../../../styles/theme';
import { NFTAudio } from './NFTAudio';
import { NFTImage } from './NFTImage';
import { NFTVideo } from './NFTVideo';

type NFTMediaReact = {
  className?: string;
  square?: boolean;
};

export function NFTMedia({ className, square }: NFTMediaReact) {
  const { mimeType } = useNFTContext();
  const { type, updateLifecycleStatus } = useNFTLifecycleContext();

  const mediaType = useMemo(() => {
    if (mimeType?.startsWith('video')) {
      return MediaType.Video;
    }
    if (mimeType?.startsWith('audio') || mimeType?.startsWith('application')) {
      return MediaType.Audio;
    }
    if (mimeType?.startsWith('image')) {
      return MediaType.Image;
    }
    return MediaType.Unknown;
  }, [mimeType]);

  const handleLoading = useCallback(
    (mediaUrl: string) => {
      updateLifecycleStatus({
        statusName: 'mediaLoading',
        statusData: {
          mediaType,
          mediaUrl,
        },
      });
    },
    [mediaType, updateLifecycleStatus],
  );

  const handleLoaded = useCallback(() => {
    // for Views, this is the success state
    updateLifecycleStatus({
      statusName: type === LifecycleType.MINT ? 'mediaLoaded' : 'success',
    });
  }, [type, updateLifecycleStatus]);

  const handleError = useCallback(
    (error: NFTError) => {
      updateLifecycleStatus({
        statusName: 'error',
        statusData: error,
      });
    },
    [updateLifecycleStatus],
  );

  const media = useMemo(() => {
    switch (mediaType) {
      case MediaType.Video:
        return (
          <NFTVideo
            square={square}
            onLoading={handleLoading}
            onLoaded={handleLoaded}
            onError={handleError}
          />
        );
      case MediaType.Audio:
        return (
          <div className="relative w-full">
            <NFTImage square={square} />
            <div className="absolute bottom-4 mx-auto w-full">
              <NFTAudio />
            </div>
          </div>
        );
      default:
        // fallback to image
        return (
          <NFTImage
            square={square}
            onLoading={handleLoading}
            onLoaded={handleLoaded}
            onError={handleError}
          />
        );
    }
  }, [handleError, handleLoaded, handleLoading, mediaType, square]);

  return <div className={cn('pb-2', className)}>{media}</div>;
}
