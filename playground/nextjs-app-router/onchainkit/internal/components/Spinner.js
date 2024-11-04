import { cn } from '../../styles/theme.js';
import { jsx } from 'react/jsx-runtime';
function Spinner({
  className
}) {
  return /*#__PURE__*/jsx("div", {
    className: "flex h-full items-center justify-center",
    "data-testid": "ockSpinner",
    children: /*#__PURE__*/jsx("div", {
      className: cn('animate-spin border-2 border-gray-200 border-t-3', 'rounded-full border-t-gray-400 px-2.5 py-2.5', className)
    })
  });
}
export { Spinner };
//# sourceMappingURL=Spinner.js.map
