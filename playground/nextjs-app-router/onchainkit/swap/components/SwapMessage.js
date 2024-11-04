import { cn, text, color } from '../../styles/theme.js';
import { getSwapMessage } from '../utils/getSwapMessage.js';
import { useSwapContext } from './SwapProvider.js';
import { jsx } from 'react/jsx-runtime';
function SwapMessage({
  className
}) {
  const _useSwapContext = useSwapContext(),
    address = _useSwapContext.address,
    to = _useSwapContext.to,
    from = _useSwapContext.from,
    lifecycleStatus = _useSwapContext.lifecycleStatus;
  const message = getSwapMessage({
    address,
    from,
    lifecycleStatus,
    to
  });
  return /*#__PURE__*/jsx("div", {
    className: cn('flex h-7 pt-2', text.label2, color.foregroundMuted, className),
    "data-testid": "ockSwapMessage_Message",
    children: message
  });
}
export { SwapMessage };
//# sourceMappingURL=SwapMessage.js.map
