import { forwardRef } from 'react';
import { caretDownSvg } from '../../internal/svg/caretDownSvg.js';
import { caretUpSvg } from '../../internal/svg/caretUpSvg.js';
import { cn, pressable, border, line, text, color } from '../../styles/theme.js';
import { TokenImage } from './TokenImage.js';
import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
const TokenSelectButton = /*#__PURE__*/forwardRef(function TokenSelectButton({
  onClick,
  token,
  isOpen,
  className
}, ref) {
  return /*#__PURE__*/jsxs("button", {
    type: "button",
    "data-testid": "ockTokenSelectButton_Button",
    className: cn(pressable.default, pressable.shadow, border.radius, line.default, 'flex w-fit items-center gap-2 px-3 py-1', className),
    onClick: onClick,
    ref: ref,
    children: [token ? /*#__PURE__*/jsxs(Fragment, {
      children: [/*#__PURE__*/jsx("div", {
        className: "w-4",
        children: /*#__PURE__*/jsx(TokenImage, {
          token: token,
          size: 16
        })
      }), /*#__PURE__*/jsx("span", {
        className: cn(text.headline, color.foreground),
        "data-testid": "ockTokenSelectButton_Symbol",
        children: token.symbol
      })]
    }) : /*#__PURE__*/jsx("span", {
      className: text.headline,
      children: "Select token"
    }), /*#__PURE__*/jsxs("div", {
      className: "relative flex items-center justify-center",
      children: [/*#__PURE__*/jsx("div", {
        className: "absolute top-0 left-0 h-4 w-4"
      }), isOpen ? caretUpSvg : caretDownSvg]
    })]
  });
});
export { TokenSelectButton };
//# sourceMappingURL=TokenSelectButton.js.map
