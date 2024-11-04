function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import { useState, useCallback, useRef, useEffect } from 'react';
import { cn, border, background } from '../../styles/theme.js';
import { useTheme } from '../../useTheme.js';
import { TokenRow } from './TokenRow.js';
import { TokenSelectButton } from './TokenSelectButton.js';
import { jsxs, jsx } from 'react/jsx-runtime';
function TokenSelectDropdown({
  options,
  setToken,
  token
}) {
  const componentTheme = useTheme();
  const _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    isOpen = _useState2[0],
    setIsOpen = _useState2[1];
  const handleToggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  /* v8 ignore next 11 */
  const handleBlur = useCallback(event => {
    const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(event.target);
    const isOutsideButton = buttonRef.current && !buttonRef.current.contains(event.target);
    if (isOutsideDropdown && isOutsideButton) {
      setIsOpen(false);
    }
  }, []);
  useEffect(() => {
    // NOTE: this ensures that handleBlur doesn't get called on initial mount
    //       We need to use non-div elements to properly handle onblur events
    setTimeout(() => {
      document.addEventListener('click', handleBlur);
    }, 0);
    return () => {
      document.removeEventListener('click', handleBlur);
    };
  }, [handleBlur]);
  return /*#__PURE__*/jsxs("div", {
    className: "relative shrink-0",
    children: [/*#__PURE__*/jsx(TokenSelectButton, {
      ref: buttonRef,
      onClick: handleToggle,
      isOpen: isOpen,
      token: token
    }), isOpen && /*#__PURE__*/jsx("div", {
      ref: dropdownRef,
      "data-testid": "ockTokenSelectDropdown_List",
      className: cn(componentTheme, border.radius, 'absolute right-0 z-10 mt-1 flex max-h-80 w-[200px] flex-col overflow-y-hidden', 'ock-scrollbar'),
      children: /*#__PURE__*/jsx("div", {
        className: "overflow-y-auto bg-[#ffffff]",
        children: options.map(token => /*#__PURE__*/jsx(TokenRow, {
          className: cn(background.inverse, 'px-4 py-2'),
          token: token,
          onClick: () => {
            setToken(token);
            handleToggle();
          }
        }, token.name + token.address))
      })
    })]
  });
}
export { TokenSelectDropdown };
//# sourceMappingURL=TokenSelectDropdown.js.map
