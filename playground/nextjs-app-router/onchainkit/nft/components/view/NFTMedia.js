import { useMemo, useCallback } from 'react';
import { MediaType, LifecycleType } from '../../types.js';
import { useNFTLifecycleContext } from '../NFTLifecycleProvider.js';
import { useNFTContext } from '../NFTProvider.js';
import { NFTAudio } from './NFTAudio.js';
import { NFTImage } from './NFTImage.js';
import { NFTVideo } from './NFTVideo.js';
import { jsx, jsxs } from 'react/jsx-runtime';
function NFTMedia({
  className,
  square
}) {
  const _useNFTContext = useNFTContext(),
    mimeType = _useNFTContext.mimeType;
  const _useNFTLifecycleConte = useNFTLifecycleContext(),
    type = _useNFTLifecycleConte.type,
    updateLifecycleStatus = _useNFTLifecycleConte.updateLifecycleStatus;
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
  const handleLoading = useCallback(mediaUrl => {
    updateLifecycleStatus({
      statusName: 'mediaLoading',
      statusData: {
        mediaType,
        mediaUrl
      }
    });
  }, [mediaType, updateLifecycleStatus]);
  const handleLoaded = useCallback(() => {
    // for Views, this is the success state
    updateLifecycleStatus({
      statusName: type === LifecycleType.MINT ? 'mediaLoaded' : 'success'
    });
  }, [type, updateLifecycleStatus]);
  const handleError = useCallback(error => {
    updateLifecycleStatus({
      statusName: 'error',
      statusData: error
    });
  }, [updateLifecycleStatus]);
  switch (mediaType) {
    case MediaType.Video:
      return /*#__PURE__*/jsx(NFTVideo, {
        className: className,
        square: square,
        onLoading: handleLoading,
        onLoaded: handleLoaded,
        onError: handleError
      });
    case MediaType.Audio:
      return /*#__PURE__*/jsxs("div", {
        className: "relative w-full",
        children: [/*#__PURE__*/jsx(NFTImage, {
          className: className,
          square: square
        }), /*#__PURE__*/jsx("div", {
          className: "absolute bottom-4 mx-auto w-full",
          children: /*#__PURE__*/jsx(NFTAudio, {})
        })]
      });
    default:
      // fallback to image
      return /*#__PURE__*/jsx(NFTImage, {
        className: className,
        square: square,
        onLoading: handleLoading,
        onLoaded: handleLoaded,
        onError: handleError
      });
  }
}
export { NFTMedia };
//# sourceMappingURL=NFTMedia.js.map
