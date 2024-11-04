import { useMemo, Children, isValidElement, cloneElement } from 'react';
import { useAccount } from 'wagmi';
import { Identity } from '../../identity/components/Identity.js';
import { cn, pressable, color } from '../../styles/theme.js';
import { useBreakpoints } from '../../useBreakpoints.js';
import { WalletBottomSheet } from './WalletBottomSheet.js';
import { jsx } from 'react/jsx-runtime';
function WalletDropdown({
  children,
  className
}) {
  const breakpoint = useBreakpoints();
  const _useAccount = useAccount(),
    address = _useAccount.address;
  const childrenArray = useMemo(() => {
    return Children.toArray(children).map(child => {
      if ( /*#__PURE__*/isValidElement(child) && child.type === Identity) {
        // @ts-ignore
        return /*#__PURE__*/cloneElement(child, {
          address
        });
      }
      return child;
    });
  }, [children, address]);
  if (!address) {
    return null;
  }
  if (!breakpoint) {
    return null;
  }
  if (breakpoint === 'sm') {
    return /*#__PURE__*/jsx(WalletBottomSheet, {
      className: className,
      children: children
    });
  }
  return /*#__PURE__*/jsx("div", {
    className: cn(pressable.default, color.foreground, 'absolute right-0 z-10 mt-1 flex w-max min-w-[300px] cursor-default flex-col overflow-hidden rounded-xl', className),
    "data-testid": "ockWalletDropdown",
    children: childrenArray
  });
}
export { WalletDropdown };
//# sourceMappingURL=WalletDropdown.js.map
