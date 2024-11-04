import { base } from 'viem/chains';
import { useAccount } from 'wagmi';
import { useName } from '../../identity/hooks/useName.js';
import { Spinner } from '../../internal/components/Spinner.js';
import { basenameSvg } from '../../internal/svg/basenameSvg.js';
import { cn, pressable, color, text } from '../../styles/theme.js';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
function WalletDropdownBasename({
  className
}) {
  const _useAccount = useAccount(),
    address = _useAccount.address;
  if (!address) {
    return null;
  }
  const _useName = useName({
      address,
      chain: base
    }),
    basename = _useName.data,
    isLoading = _useName.isLoading;
  const hasBaseUserName = !!basename;
  const title = hasBaseUserName ? 'Profile' : 'Claim Basename';
  const href = hasBaseUserName ? `https://www.base.org/name/${basename}` : 'https://www.base.org/names';
  return /*#__PURE__*/jsxs("a", {
    className: cn(pressable.default, color.foreground, 'relative flex items-center px-4 py-3', className),
    href: href,
    target: "_blank",
    rel: "noopener noreferrer",
    children: [/*#__PURE__*/jsx("div", {
      className: "-translate-y-1/2 absolute top-1/2 left-4 flex h-[1.125rem] w-[1.125rem] items-center justify-center",
      children: basenameSvg
    }), /*#__PURE__*/jsx("div", {
      className: "flex w-full items-center pl-6",
      children: isLoading ? /*#__PURE__*/jsx(Spinner, {}) : /*#__PURE__*/jsxs(Fragment, {
        children: [/*#__PURE__*/jsx("span", {
          className: cn(text.body),
          children: title
        }), !hasBaseUserName && /*#__PURE__*/jsx("span", {
          className: cn('ml-2 rounded-full bg-[#E0E7FF] px-2 py-0.5 text-center font-bold font-inter text-[#4F46E5] text-[0.6875rem] uppercase leading-none'),
          children: "NEW"
        })]
      })
    })]
  });
}
export { WalletDropdownBasename };
//# sourceMappingURL=WalletDropdownBasename.js.map
