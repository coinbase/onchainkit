import { useCallback, useMemo } from 'react';
import { LifecycleType, MediaType, type NFTError } from '../../types';
import { useNFTLifecycleContext } from '../NFTLifecycleProvider';
import { useNFTContext } from '../NFTProvider';
import { NFTAudio } from './NFTAudio';
import { NFTImage } from './NFTImage';
import { NFTVideo } from './NFTVideo';

export function NFTMedia() {
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

  switch (mediaType) {
    case MediaType.Video:
      return (
        <NFTVideo
          onLoading={handleLoading}
          onLoaded={handleLoaded}
          onError={handleError}
        />
      );
    case MediaType.Audio:
      return (
        <div className="relative w-full">
          <NFTImage />
          <div className="absolute bottom-[20px] mx-auto w-full">
            <NFTAudio />
          </div>
        </div>
      );
    default:
      // fallback to image
      return (
        <NFTImage
          onLoading={handleLoading}
          onLoaded={handleLoaded}
          onError={handleError}
        />
      );
  }
}
