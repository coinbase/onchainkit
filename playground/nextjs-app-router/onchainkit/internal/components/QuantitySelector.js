function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import { useState, useCallback } from 'react';
import { TextInput } from './TextInput.js';
import { cn, border, color, background, pressable } from '../../styles/theme.js';
import { jsxs, jsx } from 'react/jsx-runtime';
const DELAY_MS = 200;
function QuantitySelector({
  className,
  disabled,
  minQuantity = 1,
  maxQuantity = Number.MAX_SAFE_INTEGER,
  onChange,
  placeholder
}) {
  const _useState = useState(`${minQuantity}`),
    _useState2 = _slicedToArray(_useState, 2),
    value = _useState2[0],
    setValue = _useState2[1];

  // allow entering '' to enable backspace + new value, fix empty string on blur
  const isValidQuantity = useCallback(v => {
    if (Number.parseInt(v, 10) < minQuantity) {
      return false;
    }
    if (Number.parseInt(v, 10) > maxQuantity) {
      return false;
    }
    // only numbers are valid
    const regex = /^[0-9]*$/;
    return regex.test(v);
  }, [maxQuantity, minQuantity]);
  const handleIncrement = useCallback(() => {
    const next = `${Math.min(maxQuantity, Number.parseInt(value, 10) + 1)}`;
    setValue(next);
    onChange(next);
  }, [onChange, maxQuantity, value]);
  const handleDecrement = useCallback(() => {
    const next = `${Math.max(minQuantity, Number.parseInt(value, 10) - 1)}`;
    setValue(next);
    onChange(next);
  }, [onChange, minQuantity, value]);
  const handleOnChange = useCallback(v => {
    if (v === '') {
      return;
    }
    onChange(v);
  }, [onChange]);
  const handleBlur = useCallback(() => {
    if (value === '') {
      setValue(minQuantity.toString());
      onChange(minQuantity.toString());
    }
  }, [onChange, minQuantity, value]);
  const classNames = cn('h-11 w-11 rounded-lg border', border.defaultActive, color.foreground, background.default, disabled && pressable.disabled);
  return /*#__PURE__*/jsxs("div", {
    className: cn('relative flex items-center gap-1', className),
    "data-testid": "ockQuantitySelector",
    children: [/*#__PURE__*/jsx("div", {
      children: /*#__PURE__*/jsx("button", {
        "aria-label": "decrement",
        className: cn(classNames, pressable.default),
        "data-testid": "ockQuantitySelector_decrement",
        disabled: disabled,
        onClick: handleDecrement,
        type: "button",
        children: "-"
      })
    }), /*#__PURE__*/jsx(TextInput, {
      "aria-label": "quantity",
      className: cn(classNames, 'w-full text-center hover:bg-[var(--ock-bg-default-hover)] focus:bg-transparent'),
      delayMs: DELAY_MS,
      disabled: disabled,
      inputValidator: isValidQuantity,
      onBlur: handleBlur,
      onChange: handleOnChange,
      placeholder: placeholder,
      setValue: setValue,
      value: value
    }), /*#__PURE__*/jsx("div", {
      children: /*#__PURE__*/jsx("button", {
        "aria-label": "increment",
        className: cn(classNames, pressable.default),
        "data-testid": "ockQuantitySelector_increment",
        disabled: disabled,
        onClick: handleIncrement,
        type: "button",
        children: "+"
      })
    })]
  });
}
export { DELAY_MS, QuantitySelector };
//# sourceMappingURL=QuantitySelector.js.map
