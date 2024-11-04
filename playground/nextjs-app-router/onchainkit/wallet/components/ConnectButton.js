import { cn, pressable, border, text, color } from '../../styles/theme.js';
import { jsx } from 'react/jsx-runtime';
function ConnectButton({
  className,
  connectWalletText,
  onClick,
  // Text will be deprecated in the future
  text: text$1
}) {
  return /*#__PURE__*/jsx("button", {
    type: "button",
    "data-testid": "ockConnectButton",
    className: cn(pressable.primary, border.radius, text.headline, color.inverse, 'inline-flex min-w-[153px] items-center justify-center px-4 py-3', className),
    onClick: onClick,
    children: connectWalletText ? connectWalletText : /*#__PURE__*/jsx("span", {
      className: cn(color.inverse),
      children: text$1
    })
  });
}
export { ConnectButton };
//# sourceMappingURL=ConnectButton.js.map
