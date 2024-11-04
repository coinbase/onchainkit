import { cn, text, color } from '../../styles/theme.js';
import { jsx } from 'react/jsx-runtime';
function SwapSettingsSlippageTitle({
  children,
  className
}) {
  return /*#__PURE__*/jsx("h3", {
    className: cn(text.headline, color.foreground, 'mb-2 text-base', className),
    children: children
  });
}
export { SwapSettingsSlippageTitle };
//# sourceMappingURL=SwapSettingsSlippageTitle.js.map
