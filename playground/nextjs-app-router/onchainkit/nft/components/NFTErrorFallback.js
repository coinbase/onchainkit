import { cn, color, background, border } from '../../styles/theme.js';
import { useTheme } from '../../useTheme.js';
import { jsxs, jsx } from 'react/jsx-runtime';
function NFTErrorFallback({
  error
}) {
  const componentTheme = useTheme();
  return /*#__PURE__*/jsxs("div", {
    className: cn(componentTheme, color.foreground, background.default, border.defaultActive, border.radius, 'flex w-full max-w-[500px] flex-col items-center justify-center border px-6 py-4'),
    "data-testid": "ockNFTErrorFallback_Container",
    children: [/*#__PURE__*/jsx("div", {
      children: "Sorry, please try again later."
    }), /*#__PURE__*/jsx("div", {
      children: error.message
    })]
  });
}
export { NFTErrorFallback };
//# sourceMappingURL=NFTErrorFallback.js.map
