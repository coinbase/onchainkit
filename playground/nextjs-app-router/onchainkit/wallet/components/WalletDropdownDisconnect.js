import { useCallback } from 'react';
import { useDisconnect } from 'wagmi';
import { disconnectSvg } from '../../internal/svg/disconnectSvg.js';
import { cn, pressable, color, text } from '../../styles/theme.js';
import { jsxs, jsx } from 'react/jsx-runtime';
function WalletDropdownDisconnect({
  className,
  text: text$1 = 'Disconnect'
}) {
  const _useDisconnect = useDisconnect(),
    disconnect = _useDisconnect.disconnect,
    connectors = _useDisconnect.connectors;
  const handleDisconnect = useCallback(() => {
    // Disconnect all the connectors (wallets). Usually only one is connected
    connectors.map(connector => disconnect({
      connector
    }));
  }, [disconnect, connectors]);
  return /*#__PURE__*/jsxs("button", {
    type: "button",
    className: cn(pressable.default, color.foreground, 'relative flex w-full items-center px-4 pt-3 pb-4', className),
    onClick: handleDisconnect,
    children: [/*#__PURE__*/jsx("div", {
      className: "absolute left-4 flex h-[1.125rem] w-[1.125rem] items-center justify-center",
      children: disconnectSvg
    }), /*#__PURE__*/jsx("span", {
      className: cn(text.body, 'pl-6'),
      children: text$1
    })]
  });
}
export { WalletDropdownDisconnect };
//# sourceMappingURL=WalletDropdownDisconnect.js.map
