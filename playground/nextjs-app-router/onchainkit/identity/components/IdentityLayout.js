import { useMemo, Children, cloneElement } from 'react';
import { findComponent } from '../../internal/utils/findComponent.js';
import { cn, background, color } from '../../styles/theme.js';
import { useTheme } from '../../useTheme.js';
import { Address } from './Address.js';
import { Avatar } from './Avatar.js';
import { EthBalance } from './EthBalance.js';
import { Name } from './Name.js';
import { Socials } from './Socials.js';
import { jsxs, jsx } from 'react/jsx-runtime';
function IdentityLayout({
  children,
  className,
  hasCopyAddressOnClick
}) {
  const componentTheme = useTheme();
  const _useMemo = useMemo(() => {
      const childrenArray = Children.toArray(children);
      const addressElement = childrenArray.find(findComponent(Address));
      return {
        avatar: childrenArray.find(findComponent(Avatar)),
        name: childrenArray.find(findComponent(Name)),
        address: addressElement ? /*#__PURE__*/cloneElement(addressElement, {
          hasCopyAddressOnClick
        }) : undefined,
        ethBalance: childrenArray.find(findComponent(EthBalance)),
        socials: childrenArray.find(findComponent(Socials))
      };
    }, [children, hasCopyAddressOnClick]),
    avatar = _useMemo.avatar,
    name = _useMemo.name,
    addressComponent = _useMemo.address,
    ethBalance = _useMemo.ethBalance,
    socials = _useMemo.socials;
  return /*#__PURE__*/jsxs("div", {
    className: cn(componentTheme, background.default, 'flex flex-col px-4 py-1', className),
    "data-testid": "ockIdentityLayout_container",
    children: [/*#__PURE__*/jsxs("div", {
      className: "flex items-center space-x-3",
      children: [/*#__PURE__*/jsx("div", {
        className: "flex-shrink-0",
        children: avatar
      }), /*#__PURE__*/jsxs("div", {
        className: "flex flex-col",
        children: [name, addressComponent && !ethBalance && addressComponent, !addressComponent && ethBalance && ethBalance, addressComponent && ethBalance && /*#__PURE__*/jsxs("div", {
          className: "flex items-center gap-1",
          children: [addressComponent, /*#__PURE__*/jsx("span", {
            className: color.foregroundMuted,
            children: "\xB7"
          }), ethBalance]
        })]
      })]
    }), socials]
  });
}
export { IdentityLayout };
//# sourceMappingURL=IdentityLayout.js.map
