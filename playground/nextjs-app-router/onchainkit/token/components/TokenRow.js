import { memo } from 'react';
import { cn, pressable, text, color } from '../../styles/theme.js';
import { useTheme } from '../../useTheme.js';
import { formatAmount } from '../utils/formatAmount.js';
import { TokenImage } from './TokenImage.js';
import { jsxs, jsx } from 'react/jsx-runtime';
const TokenRow = /*#__PURE__*/memo(function TokenRow({
  className,
  token,
  amount,
  onClick,
  hideImage,
  hideSymbol
}) {
  const componentTheme = useTheme();
  return /*#__PURE__*/jsxs("button", {
    "data-testid": "ockTokenRow_Container",
    type: "button",
    className: cn(componentTheme, pressable.default, 'flex w-full items-center justify-between px-2 py-1', className),
    onClick: () => onClick?.(token),
    children: [/*#__PURE__*/jsxs("span", {
      className: "flex items-center gap-3",
      children: [!hideImage && /*#__PURE__*/jsx(TokenImage, {
        token: token,
        size: 28
      }), /*#__PURE__*/jsxs("span", {
        className: "flex flex-col items-start",
        children: [/*#__PURE__*/jsx("span", {
          className: cn(text.headline),
          children: token.name
        }), !hideSymbol && /*#__PURE__*/jsx("span", {
          className: cn(text.body, color.foregroundMuted),
          children: token.symbol
        })]
      })]
    }), /*#__PURE__*/jsx("span", {
      "data-testid": "ockTokenRow_Amount",
      className: cn(text.body, color.foregroundMuted),
      children: formatAmount(amount, {
        minimumFractionDigits: 2,
        maximumFractionDigits: Number(amount) < 1 ? 5 : 2
      })
    })]
  });
});
export { TokenRow };
//# sourceMappingURL=TokenRow.js.map
