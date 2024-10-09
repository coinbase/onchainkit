import { useCallback, useMemo } from 'react';
import { useNftContext } from './NftProvider';
// import { NftAudio } from "./NftAudio";
import { NftImage } from './NftImage';
import { NftVideo } from './NftVideo';
import { useNftLifecycleContext } from './NftLifecycleProvider';
import { LifecycleType, type NftError } from '../types';

export function NftMedia() {
  const { mimeType } = useNftContext();
  const { type, updateLifecycleStatus } = useNftLifecycleContext();

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
    (error: NftError) => {
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
      isAudio: mimeType?.startsWith('audio'),
      isImage: mimeType?.startsWith('image'),
      isSvg: mimeType?.startsWith('image/svg+xml'),
    };
  }, [mimeType]);

  if (mediaType.isVideo) {
    return (
      <NftVideo
        onLoading={handleLoading}
        onLoaded={handleLoaded}
        onError={handleError}
      />
    );
  }

  // if (mediaType.isAudio) {
  //   return (
  //     <div className="relative w-full">
  //       <NftImage />
  //       <div className="absolute bottom-[20px] mx-auto w-full">
  //         <NftAudio />
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <NftImage
      onLoading={handleLoading}
      onLoaded={handleLoaded}
      onError={handleError}
    />
  );
}
