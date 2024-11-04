import { cn, text, color } from '../../styles/theme.js';
import { jsx } from 'react/jsx-runtime';
function ConnectWalletText({
  children,
  className
}) {
  return /*#__PURE__*/jsx("span", {
    className: cn(text.headline, color.inverse, className),
    children: children
  });
}
export { ConnectWalletText };
//# sourceMappingURL=ConnectWalletText.js.map
