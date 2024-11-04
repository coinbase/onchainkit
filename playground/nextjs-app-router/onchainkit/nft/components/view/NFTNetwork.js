import { useAccount } from 'wagmi';
import { baseSvg } from '../../../internal/svg/baseSvg.js';
import { cn, text, color } from '../../../styles/theme.js';
import { jsxs, jsx } from 'react/jsx-runtime';
const networkMap = {
  Base: baseSvg
};
function NFTNetwork({
  className,
  label = 'Network'
}) {
  const _useAccount = useAccount(),
    chain = _useAccount.chain;
  if (!chain || !networkMap[chain.name]) {
    return null;
  }
  return /*#__PURE__*/jsxs("div", {
    className: cn('flex items-center justify-between py-0.5', text.label2, className),
    children: [/*#__PURE__*/jsx("div", {
      className: cn(color.foregroundMuted),
      children: label
    }), /*#__PURE__*/jsxs("div", {
      className: "flex items-center gap-1",
      children: [/*#__PURE__*/jsx("div", {
        className: "h-4 w-4 object-cover",
        children: networkMap[chain.name]
      }), /*#__PURE__*/jsx("div", {
        children: chain.name
      })]
    })]
  });
}
export { NFTNetwork };
//# sourceMappingURL=NFTNetwork.js.map
