function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import { useState, useCallback } from 'react';
import { TextInput } from '../../internal/components/TextInput.js';
import { closeSvg } from '../../internal/svg/closeSvg.js';
import { searchIconSvg } from '../../internal/svg/searchIconSvg.js';
import { cn, pressable, color, placeholder } from '../../styles/theme.js';
import { useTheme } from '../../useTheme.js';
import { jsxs, jsx } from 'react/jsx-runtime';
function TokenSearch({
  className,
  onChange,
  delayMs = 200
}) {
  const componentTheme = useTheme();
  const _useState = useState(''),
    _useState2 = _slicedToArray(_useState, 2),
    value = _useState2[0],
    setValue = _useState2[1];
  const handleClear = useCallback(() => {
    setValue('');
    onChange('');
  }, [onChange]);
  return /*#__PURE__*/jsxs("div", {
    className: "relative flex items-center",
    children: [/*#__PURE__*/jsx("div", {
      className: "-translate-y-1/2 absolute top-1/2 left-4",
      children: searchIconSvg
    }), /*#__PURE__*/jsx(TextInput, {
      className: cn(componentTheme, pressable.alternate, color.foreground, placeholder.default, 'w-full rounded-xl py-2 pr-5 pl-12 outline-none', className),
      placeholder: "Search for a token",
      value: value,
      setValue: setValue,
      onChange: onChange,
      delayMs: delayMs
    }), value && /*#__PURE__*/jsx("button", {
      type: "button",
      "data-testid": "ockTextInput_Clear",
      className: "-translate-y-1/2 absolute top-1/2 right-4",
      onClick: handleClear,
      children: closeSvg
    })]
  });
}
export { TokenSearch };
//# sourceMappingURL=TokenSearch.js.map
