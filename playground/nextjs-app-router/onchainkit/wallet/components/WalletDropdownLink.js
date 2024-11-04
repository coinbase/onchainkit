import { useIcon } from '../../internal/hooks/useIcon.js';
import { cn, pressable, color, text } from '../../styles/theme.js';
import { jsxs, jsx } from 'react/jsx-runtime';
function WalletDropdownLink({
  children,
  className,
  icon,
  href,
  rel,
  target
}) {
  const iconSvg = useIcon({
    icon
  });
  return /*#__PURE__*/jsxs("a", {
    className: cn(pressable.default, color.foreground, 'relative flex items-center px-4 py-3', className),
    href: href,
    target: target,
    rel: rel,
    children: [/*#__PURE__*/jsx("div", {
      className: "-translate-y-1/2 absolute top-1/2 left-4 flex h-[1.125rem] w-[1.125rem] items-center justify-center",
      children: iconSvg
    }), /*#__PURE__*/jsx("span", {
      className: cn(text.body, 'pl-6'),
      children: children
    })]
  });
}
export { WalletDropdownLink };
//# sourceMappingURL=WalletDropdownLink.js.map
