import { cn, text, color } from '../../styles/theme.js';
import { jsx } from 'react/jsx-runtime';
function SwapSettingsSlippageDescription({
  children,
  className
}) {
  return /*#__PURE__*/jsx("p", {
    className: cn(text.legal, color.foregroundMuted, 'mb-2', className),
    children: children
  });
}
export { SwapSettingsSlippageDescription };
//# sourceMappingURL=SwapSettingsSlippageDescription.js.map
