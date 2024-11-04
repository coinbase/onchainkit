function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import { useState, useCallback, useMemo } from 'react';
import { infoSvg } from '../../../internal/svg/infoSvg.js';
import { multiplyFloats } from '../../../internal/utils/multiplyFloats.js';
import { cn, background, border, text } from '../../../styles/theme.js';
import { formatAmount } from '../../../token/utils/formatAmount.js';
import { useNFTContext } from '../NFTProvider.js';
import { jsxs, jsx } from 'react/jsx-runtime';
function NFTTotalCost({
  className,
  label = 'Total cost'
}) {
  const _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    isOverlayVisible = _useState2[0],
    setIsOverlayVisible = _useState2[1];
  const _useNFTContext = useNFTContext(),
    price = _useNFTContext.price,
    mintFee = _useNFTContext.mintFee,
    quantity = _useNFTContext.quantity;
  const toggleOverlay = useCallback(() => {
    setIsOverlayVisible(prev => !prev);
  }, []);
  const showOverlay = useCallback(() => {
    setIsOverlayVisible(true);
  }, []);
  const hideOverlay = useCallback(() => {
    setIsOverlayVisible(false);
  }, []);
  const overlay = useMemo(() => {
    // only show overlay if mintFee
    if (price?.amount === undefined || price?.amountUSD === undefined || mintFee?.amount === undefined || mintFee.amountUSD === undefined) {
      return null;
    }
    return /*#__PURE__*/jsxs("div", {
      className: cn(background.default, border.radius, border.defaultActive, 'absolute z-10 w-full border'),
      children: [/*#__PURE__*/jsxs("div", {
        className: cn('flex items-center justify-between px-4 py-2', text.label2),
        children: [/*#__PURE__*/jsx("div", {
          children: "NFT cost"
        }), /*#__PURE__*/jsxs("div", {
          children: ["$", formatAmount(`${multiplyFloats(Number(price.amountUSD), quantity)}`, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })]
        })]
      }), /*#__PURE__*/jsxs("div", {
        className: cn('flex items-center justify-between px-4 py-2', text.label2),
        children: [/*#__PURE__*/jsx("div", {
          children: "Mint fee"
        }), /*#__PURE__*/jsxs("div", {
          children: ["$", formatAmount(`${multiplyFloats(Number(mintFee.amountUSD), quantity)}`, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })]
        })]
      })]
    });
  }, [mintFee, price, quantity]);
  if (!price?.amount || !price?.currency || !price?.amountUSD || !mintFee?.amount || !mintFee.amountUSD) {
    return null;
  }
  return /*#__PURE__*/jsxs("div", {
    className: "relative",
    children: [/*#__PURE__*/jsxs("div", {
      className: cn('flex items-center justify-between pt-2 pb-1', text.label2, className),
      children: [/*#__PURE__*/jsx("div", {
        children: label
      }), /*#__PURE__*/jsxs("div", {
        className: "flex items-center gap-2",
        children: [/*#__PURE__*/jsxs("div", {
          children: ["$", formatAmount(`${multiplyFloats(Number(price.amountUSD), quantity)}`, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })]
        }), overlay && /*#__PURE__*/jsx("button", {
          type: "button",
          "data-testid": "ockNFTTotalCostInfo",
          className: "h-2.5 w-2.5 cursor-pointer object-cover",
          onClick: toggleOverlay,
          onMouseEnter: showOverlay,
          onMouseLeave: hideOverlay,
          children: infoSvg
        })]
      })]
    }), isOverlayVisible && overlay]
  });
}
export { NFTTotalCost };
//# sourceMappingURL=NFTTotalCost.js.map
