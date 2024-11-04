function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import { useState, useRef, useCallback, useEffect } from 'react';
import { useIcon } from '../../internal/hooks/useIcon.js';
import { cn, text, pressable, background, border } from '../../styles/theme.js';
import { useBreakpoints } from '../../useBreakpoints.js';
import { SwapSettingsSlippageLayout } from './SwapSettingsSlippageLayout.js';
import { SwapSettingsSlippageLayoutBottomSheet } from './SwapSettingsSlippageLayoutBottomSheet.js';
import { jsxs, jsx } from 'react/jsx-runtime';
function SwapSettings({
  children,
  className,
  icon = 'swapSettings',
  text: buttonText = ''
}) {
  const breakpoint = useBreakpoints();
  const _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    isOpen = _useState2[0],
    setIsOpen = _useState2[1];
  const dropdownRef = useRef(null);
  const handleToggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);
  const handleClickOutsideComponent = useCallback(event => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  }, []);
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideComponent);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideComponent);
    };
  }, [handleClickOutsideComponent]);
  const iconSvg = useIcon({
    icon
  });
  return /*#__PURE__*/jsxs("div", {
    className: cn('flex w-full items-center justify-end space-x-1', className),
    "data-testid": "ockSwapSettings_Settings",
    children: [buttonText && /*#__PURE__*/jsx("span", {
      className: cn(text.body),
      children: buttonText
    }), /*#__PURE__*/jsxs("div", {
      className: cn('relative', isOpen && 'group'),
      ref: dropdownRef,
      children: [/*#__PURE__*/jsx("button", {
        type: "button",
        "aria-label": "Toggle swap settings",
        className: cn(pressable.default, 'rounded-full p-2 opacity-50 transition-opacity hover:opacity-100'),
        onClick: handleToggle,
        children: /*#__PURE__*/jsx("div", {
          className: "h-[1.125rem] w-[1.125rem]",
          children: iconSvg
        })
      }), breakpoint === 'sm' ? /*#__PURE__*/jsx("div", {
        className: cn(background.inverse, pressable.shadow, 'fixed inset-x-0 z-50 transition-[bottom] duration-300 ease-in-out', '-bottom-[12.875rem] h-[12.875rem] rounded-t-lg group-[]:bottom-0', className),
        "data-testid": "ockSwapSettingsSlippageLayoutBottomSheet_container",
        children: /*#__PURE__*/jsx(SwapSettingsSlippageLayoutBottomSheet, {
          className: className,
          children: children
        })
      }) : isOpen && /*#__PURE__*/jsx("div", {
        className: cn(border.radius, background.default, pressable.shadow, 'absolute right-0 z-10 mt-1 w-[21.75rem] rounded-lg'),
        "data-testid": "ockSwapSettingsDropdown",
        children: /*#__PURE__*/jsx(SwapSettingsSlippageLayout, {
          children: children
        })
      })]
    })]
  });
}
export { SwapSettings };
//# sourceMappingURL=SwapSettings.js.map
