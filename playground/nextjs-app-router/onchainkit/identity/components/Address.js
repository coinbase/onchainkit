function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import { useState } from 'react';
import { cn, color, text, pressable, border } from '../../styles/theme.js';
import { getSlicedAddress } from '../utils/getSlicedAddress.js';
import { useIdentityContext } from './IdentityProvider.js';
import { jsx, jsxs } from 'react/jsx-runtime';
function Address({
  address = null,
  className,
  isSliced = true,
  hasCopyAddressOnClick = true
}) {
  const _useState = useState('Copy'),
    _useState2 = _slicedToArray(_useState, 2),
    copyText = _useState2[0],
    setCopyText = _useState2[1];
  const _useIdentityContext = useIdentityContext(),
    contextAddress = _useIdentityContext.address;
  const accountAddress = address ?? contextAddress;
  if (!accountAddress) {
    console.error('Address: an Ethereum address must be provided to the Identity or Address component.');
    return null;
  }
  const addressContent = isSliced ? getSlicedAddress(accountAddress) : accountAddress;

  // Non-interactive version
  if (!hasCopyAddressOnClick) {
    return /*#__PURE__*/jsx("span", {
      "data-testid": "ockAddress",
      className: cn(color.foregroundMuted, text.label2, className),
      children: addressContent
    });
  }

  // Interactive version with copy functionality
  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(accountAddress);
      setCopyText('Copied');
      setTimeout(() => setCopyText('Copy'), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
      setCopyText('Failed to copy');
      setTimeout(() => setCopyText('Copy'), 2000);
    }
  };
  const handleKeyDown = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };
  return /*#__PURE__*/jsxs("span", {
    "data-testid": "ockAddress",
    className: cn(color.foregroundMuted, text.label2, className, 'group relative cursor-pointer'),
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    tabIndex: 0,
    role: "button",
    "aria-label": `Copy address ${accountAddress}`,
    children: [addressContent, /*#__PURE__*/jsx("button", {
      type: "button",
      className: cn(pressable.alternate, text.legal, color.foreground, border.default, border.radius, 'absolute top-full left-[0%] z-10 mt-0.5 px-1.5 py-0.5 opacity-0 transition-opacity group-hover:opacity-100'),
      "aria-live": "polite",
      children: copyText
    })]
  });
}
export { Address };
//# sourceMappingURL=Address.js.map
