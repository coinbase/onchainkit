import { useCallback, useMemo } from 'react';
import { LifecycleType, MediaType, type NFTError } from '../../types';
import { useNFTLifecycleContext } from '../NFTLifecycleProvider';
import { useNFTContext } from '../NFTProvider';
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
            className={className}
            square={square}
            onLoading={handleLoading}
            onLoaded={handleLoaded}
            onError={handleError}
          />
        );
      case MediaType.Audio:
        return (
          <div className="relative w-full">
            <NFTImage className={className} square={square} />
            <div className="absolute bottom-4 mx-auto w-full">
              <NFTAudio />
            </div>
          </div>
        );
      default:
        // fallback to image
        return (
          <NFTImage
            className={className}
            square={square}
            onLoading={handleLoading}
            onLoaded={handleLoaded}
            onError={handleError}
          />
        );
    }
  }, [className, handleError, handleLoaded, handleLoading, mediaType, square]);

  return <div className="pb-2">{media}</div>;
}
