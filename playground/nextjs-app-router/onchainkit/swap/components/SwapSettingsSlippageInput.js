function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import { useState, useCallback } from 'react';
import { cn, background, border, pressable, color, text } from '../../styles/theme.js';
import { useSwapContext } from './SwapProvider.js';
import { jsxs, jsx } from 'react/jsx-runtime';
const SLIPPAGE_SETTINGS = {
  AUTO: 'Auto',
  CUSTOM: 'Custom'
};
function SwapSettingsSlippageInput({
  className
}) {
  const _useSwapContext = useSwapContext(),
    defaultMaxSlippage = _useSwapContext.config.maxSlippage,
    updateLifecycleStatus = _useSwapContext.updateLifecycleStatus,
    lifecycleStatus = _useSwapContext.lifecycleStatus;

  // Set initial slippage values to match previous selection or default,
  // ensuring consistency when dropdown is reopened
  const _useState = useState(lifecycleStatus.statusData.maxSlippage === defaultMaxSlippage ? SLIPPAGE_SETTINGS.AUTO : SLIPPAGE_SETTINGS.CUSTOM),
    _useState2 = _slicedToArray(_useState, 2),
    slippageSetting = _useState2[0],
    setSlippageSetting = _useState2[1];
  const updateSlippage = useCallback(newSlippage => {
    if (newSlippage !== lifecycleStatus.statusData.maxSlippage) {
      updateLifecycleStatus({
        statusName: 'slippageChange',
        statusData: {
          maxSlippage: newSlippage
        }
      });
    }
  }, [lifecycleStatus.statusData.maxSlippage, updateLifecycleStatus]);

  // Handles user input for custom slippage.
  // Parses the input and updates slippage state.
  const handleSlippageChange = useCallback(e => {
    const newSlippage = e.target.value;
    const parsedSlippage = Number.parseFloat(newSlippage);
    const isValidNumber = !Number.isNaN(parsedSlippage);

    // Update slippage to parsed value if valid, otherwise set to 0
    updateSlippage(isValidNumber ? parsedSlippage : 0);
  }, [updateSlippage]);

  // Toggles between auto and custom slippage settings
  // Resets to default slippage when auto is selected
  const handleSlippageSettingChange = useCallback(setting => {
    setSlippageSetting(setting);
    if (setting === SLIPPAGE_SETTINGS.AUTO) {
      updateSlippage(defaultMaxSlippage);
    }
  }, [defaultMaxSlippage, updateSlippage]);
  return /*#__PURE__*/jsxs("section", {
    className: cn(background.default, border.defaultActive, border.radius, 'flex items-center gap-2', className),
    children: [/*#__PURE__*/jsxs("fieldset", {
      className: cn(background.default, border.defaultActive, border.radius, 'flex h-9 flex-1 rounded-xl border p-1'),
      children: [/*#__PURE__*/jsx("legend", {
        className: "sr-only",
        children: "Slippage Setting"
      }), Object.values(SLIPPAGE_SETTINGS).map(setting => /*#__PURE__*/jsx("button", {
        type: "button",
        className: cn(pressable.default, color.foreground, text.label1, border.radiusInner, 'flex-1 px-3 py-1 transition-colors',
        // Highlight the button if it is selected
        slippageSetting === setting ? cn(background.inverse, color.primary, pressable.shadow) : color.foregroundMuted),
        onClick: () => handleSlippageSettingChange(setting),
        children: setting
      }, setting))]
    }), /*#__PURE__*/jsxs("div", {
      className: cn(background.default, border.defaultActive, border.radius, 'flex h-9 w-24 items-center justify-between border px-2 py-1', slippageSetting === SLIPPAGE_SETTINGS.AUTO && 'opacity-50'),
      children: [/*#__PURE__*/jsx("label", {
        htmlFor: "slippage-input",
        className: "sr-only",
        children: "Slippage Percentage"
      }), /*#__PURE__*/jsx("input", {
        id: "slippage-input",
        type: "text",
        value: lifecycleStatus.statusData.maxSlippage,
        onChange: handleSlippageChange,
        disabled: slippageSetting === SLIPPAGE_SETTINGS.AUTO,
        className: cn(color.foreground, text.label2, 'w-full flex-grow bg-transparent pl-1 font-normal leading-6 focus:outline-none', slippageSetting === SLIPPAGE_SETTINGS.AUTO && 'cursor-not-allowed')
      }), /*#__PURE__*/jsx("span", {
        className: cn(background.default, color.foreground, text.label2, 'ml-1 flex-shrink-0 font-normal leading-6'),
        children: "%"
      })]
    })]
  });
}
export { SwapSettingsSlippageInput };
//# sourceMappingURL=SwapSettingsSlippageInput.js.map
