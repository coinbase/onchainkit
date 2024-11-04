import { cn, pressable, text } from '../../styles/theme.js';
import { useTheme } from '../../useTheme.js';
import { TokenImage } from './TokenImage.js';
import { jsxs, jsx } from 'react/jsx-runtime';
function TokenChip({
  token,
  onClick,
  className
}) {
  const componentTheme = useTheme();
  return /*#__PURE__*/jsxs("button", {
    type: "button",
    "data-testid": "ockTokenChip_Button",
    className: cn(componentTheme, pressable.secondary, pressable.shadow, 'flex w-fit shrink-0 items-center gap-2 rounded-lg py-1 pr-3 pl-1 ', className),
    onClick: () => onClick?.(token),
    children: [/*#__PURE__*/jsx(TokenImage, {
      token: token,
      size: 24
    }), /*#__PURE__*/jsx("span", {
      className: text.headline,
      children: token.symbol
    })]
  });
}
export { TokenChip };
//# sourceMappingURL=TokenChip.js.map
