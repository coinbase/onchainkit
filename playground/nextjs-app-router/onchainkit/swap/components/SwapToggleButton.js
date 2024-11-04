import { toggleSvg } from '../../internal/svg/toggleSvg.js';
import { cn, pressable, border } from '../../styles/theme.js';
import { useSwapContext } from './SwapProvider.js';
import { jsx } from 'react/jsx-runtime';
function SwapToggleButton({
  className
}) {
  const _useSwapContext = useSwapContext(),
    handleToggle = _useSwapContext.handleToggle;
  return /*#__PURE__*/jsx("button", {
    type: "button",
    className: cn(pressable.alternate, border.default, '-translate-x-2/4 -translate-y-2/4 absolute top-2/4 left-2/4', 'flex h-12 w-12 items-center justify-center', 'rounded-lg border-4 border-solid', className),
    "data-testid": "SwapTokensButton",
    onClick: handleToggle,
    children: toggleSvg
  });
}
export { SwapToggleButton };
//# sourceMappingURL=SwapToggleButton.js.map
