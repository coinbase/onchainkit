import { useCallback, useMemo } from 'react';
import { LifecycleType, type NFTError } from '../../types';
import { useNFTLifecycleContext } from '../NFTLifecycleProvider';
import { useNFTContext } from '../NFTProvider';
import { NFTAudio } from './NFTAudio';
import { NFTImage } from './NFTImage';
import { NFTVideo } from './NFTVideo';

export function NFTMedia() {
  const { mimeType } = useNFTContext();
  const { type, updateLifecycleStatus } = useNFTLifecycleContext();

  const handleLoading = useCallback(
    (mediaUrl: string) => {
      updateLifecycleStatus({
        statusName: 'mediaLoading',
        statusData: {
          mimeType,
          mediaUrl,
        },
      });
    },
    [mimeType, updateLifecycleStatus],
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

  const mediaType = useMemo(() => {
    return {
      isVideo: mimeType?.startsWith('video'),
      isAudio:
        mimeType?.startsWith('audio') || mimeType?.startsWith('application'),
      isImage: mimeType?.startsWith('image'),
    };
  }, [mimeType]);

  if (mediaType.isVideo) {
    return (
      <NFTVideo
        onLoading={handleLoading}
        onLoaded={handleLoaded}
        onError={handleError}
      />
    );
  }

  if (mediaType.isAudio) {
    return (
      <div className="relative w-full">
        <NFTImage />
        <div className="absolute bottom-[20px] mx-auto w-full">
          <NFTAudio />
        </div>
      </div>
    );
  }

  return (
    <NFTImage
      onLoading={handleLoading}
      onLoaded={handleLoaded}
      onError={handleError}
    />
  );
}
