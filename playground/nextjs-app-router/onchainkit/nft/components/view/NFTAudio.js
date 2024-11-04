function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import { useRef, useState, useEffect, useCallback } from 'react';
import { cn, background } from '../../../styles/theme.js';
import { useNFTContext } from '../NFTProvider.js';
import { jsxs, jsx } from 'react/jsx-runtime';
function NFTAudio({
  className,
  onLoading,
  onLoaded,
  onError
}) {
  const _useNFTContext = useNFTContext(),
    animationUrl = _useNFTContext.animationUrl;
  const audioRef = useRef(null);
  const _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    isPlaying = _useState2[0],
    setIsPlaying = _useState2[1];
  useEffect(() => {
    function onEnded() {
      setIsPlaying(false);
    }
    if (animationUrl && audioRef?.current) {
      audioRef.current.onloadstart = () => {
        onLoading?.(animationUrl);
      };
      audioRef.current.onloadeddata = () => {
        onLoaded?.();
      };
      audioRef.current.addEventListener('ended', onEnded);
      audioRef.current.onerror = error => {
        onError?.({
          error: typeof error === 'string' ? error : error.type,
          code: 'NmNAc01',
          // NFT module NFTAudio component 01 error
          message: 'Error loading audio'
        });
      };
    }
  }, [animationUrl, onLoading, onLoaded, onError]);
  const handlePlayPause = useCallback(event => {
    event.stopPropagation();
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  }, [isPlaying]);
  if (!animationUrl) {
    return null;
  }
  return /*#__PURE__*/jsxs("div", {
    className: cn('max-h-350 w-350 max-w-350', className),
    children: [/*#__PURE__*/jsx("button", {
      type: "button",
      className: cn(background.reverse, 'ml-6 inline-flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-full'),
      onClick: handlePlayPause,
      children: /*#__PURE__*/jsx("div", {
        className: cn('ml-px box-border h-[18px] transition-all ease-[100ms] will-change-[border-width]', 'border-transparent border-l-[var(--ock-bg-default)] hover:border-l-[var(--ock-bg-default-hover)]', {
          'border-[length:0_0_0_16px] border-double': isPlaying,
          '-mr-px border-[length:9px_0_9px_16px] border-solid': !isPlaying
        })
      })
    }), /*#__PURE__*/jsx("audio", {
      ref: audioRef,
      "data-testid": "ockNFTAudio",
      autoPlay: false,
      controls: false,
      src: animationUrl,
      children: /*#__PURE__*/jsx("track", {
        kind: "captions"
      })
    })]
  });
}
export { NFTAudio };
//# sourceMappingURL=NFTAudio.js.map
