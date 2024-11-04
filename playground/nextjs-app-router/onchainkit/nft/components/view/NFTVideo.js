import { useRef, useEffect } from 'react';
import { defaultNFTSvg } from '../../../internal/svg/defaultNFTSvg.js';
import { cn } from '../../../styles/theme.js';
import { useNFTContext } from '../NFTProvider.js';
import { jsx } from 'react/jsx-runtime';
function NFTVideo({
  className,
  square = true,
  onLoading,
  onLoaded,
  onError
}) {
  const _useNFTContext = useNFTContext(),
    animationUrl = _useNFTContext.animationUrl,
    imageUrl = _useNFTContext.imageUrl;
  const videoRef = useRef(null);
  useEffect(() => {
    if (animationUrl && videoRef?.current) {
      videoRef.current.onloadstart = () => {
        onLoading?.(animationUrl);
      };
      videoRef.current.onloadeddata = () => {
        onLoaded?.();
      };
      videoRef.current.onerror = error => {
        onError?.({
          error: typeof error === 'string' ? error : error.type,
          code: 'NmNVc01',
          // NFT module NFTVideo component 01 error
          message: 'Error loading video'
        });
      };
    }
  }, [animationUrl, onLoading, onLoaded, onError]);
  if (!animationUrl) {
    return /*#__PURE__*/jsx("div", {
      className: "max-h-350 w-350 max-w-350",
      children: defaultNFTSvg
    });
  }
  return /*#__PURE__*/jsx("div", {
    className: cn('relative flex h-[450px] max-h-screen items-center justify-center', className),
    children: /*#__PURE__*/jsx("video", {
      ref: videoRef,
      "data-testid": "ockNFTVideo",
      className: cn({
        'h-full w-full object-cover': square
      }),
      poster: imageUrl,
      controls: true,
      loop: true,
      src: animationUrl,
      muted: true,
      autoPlay: true,
      playsInline: true,
      draggable: false,
      width: "100%"
    })
  });
}
export { NFTVideo };
//# sourceMappingURL=NFTVideo.js.map
