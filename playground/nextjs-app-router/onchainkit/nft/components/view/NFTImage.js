function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import { useState, useCallback, useEffect } from 'react';
import { defaultNFTSvg } from '../../../internal/svg/defaultNFTSvg.js';
import { cn } from '../../../styles/theme.js';
import { useNFTContext } from '../NFTProvider.js';
import { jsxs, jsx } from 'react/jsx-runtime';
function NFTImage({
  className,
  square = true,
  onLoading,
  onLoaded,
  onError
}) {
  const _useNFTContext = useNFTContext(),
    imageUrl = _useNFTContext.imageUrl,
    description = _useNFTContext.description;
  const _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    loaded = _useState2[0],
    setLoaded = _useState2[1];
  const _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    error = _useState4[0],
    setError = _useState4[1];
  const _useState5 = useState(false),
    _useState6 = _slicedToArray(_useState5, 2),
    transitionEnded = _useState6[0],
    setTransitionEnded = _useState6[1];
  const loadImage = useCallback(() => {
    if (imageUrl) {
      onLoading?.(imageUrl);
      const img = new Image();
      img.onload = () => {
        setLoaded(true);
        onLoaded?.();
      };
      img.onerror = error => {
        onError?.({
          error: typeof error === 'string' ? error : error.type,
          code: 'NmNIc01',
          // NFT module NFTImage component 01 error
          message: 'Error loading image'
        });
        setError(true);
      };
      img.src = imageUrl;
    }
  }, [imageUrl, onLoading, onLoaded, onError]);
  useEffect(() => {
    loadImage();
  }, [loadImage]);
  const handleRetry = useCallback(async () => {
    setError(false);
    loadImage();
  }, [loadImage]);
  const handleTransitionEnd = useCallback(() => {
    setTransitionEnded(true);
  }, []);
  return /*#__PURE__*/jsxs("div", {
    className: cn('relative flex h-[450px] max-h-screen items-center justify-center', className),
    children: [error && /*#__PURE__*/jsx("div", {
      className: "absolute top-[60%] z-10",
      children: /*#__PURE__*/jsx("button", {
        type: "button",
        onClick: handleRetry,
        children: "retry"
      })
    }), !transitionEnded && /*#__PURE__*/jsx("div", {
      className: `absolute inset-0 ${loaded ? 'opacity-0' : 'opacity-100'} transition-[opacity] duration-500 ease-in-out`,
      children: defaultNFTSvg
    }), /*#__PURE__*/jsx("img", {
      "data-testid": "ockNFTImage",
      src: imageUrl,
      alt: description,
      decoding: "async",
      className: cn('max-h-[450px] transition-[opacity] duration-500 ease-in-out', `${loaded ? 'opacity-100' : 'opacity-0'}`, {
        'h-full w-full object-cover': square
      }),
      onTransitionEnd: handleTransitionEnd
    })]
  });
}
export { NFTImage };
//# sourceMappingURL=NFTImage.js.map
