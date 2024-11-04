const _excluded = ["address", "chain", "className", "defaultComponent", "loadingComponent", "children"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var s = Object.getOwnPropertySymbols(e); for (r = 0; r < s.length; r++) o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
import { useMemo, Children } from 'react';
import { defaultAvatarSVG } from '../../internal/svg/defaultAvatarSVG.js';
import { defaultLoadingSVG } from '../../internal/svg/defaultLoadingSVG.js';
import { findComponent } from '../../internal/utils/findComponent.js';
import { cn } from '../../styles/theme.js';
import { useAvatar } from '../hooks/useAvatar.js';
import { useName } from '../hooks/useName.js';
import { Badge } from './Badge.js';
import { DisplayBadge } from './DisplayBadge.js';
import { useIdentityContext } from './IdentityProvider.js';
import { jsx, jsxs } from 'react/jsx-runtime';
function Avatar(_ref) {
  let _ref$address = _ref.address,
    address = _ref$address === void 0 ? null : _ref$address,
    chain = _ref.chain,
    className = _ref.className,
    defaultComponent = _ref.defaultComponent,
    loadingComponent = _ref.loadingComponent,
    children = _ref.children,
    props = _objectWithoutProperties(_ref, _excluded);
  const _useIdentityContext = useIdentityContext(),
    contextAddress = _useIdentityContext.address,
    contextChain = _useIdentityContext.chain;
  const accountAddress = address ?? contextAddress;
  const accountChain = chain ?? contextChain;
  if (!accountAddress) {
    console.error('Avatar: an Ethereum address must be provided to the Identity or Avatar component.');
    return null;
  }

  // The component first attempts to retrieve the ENS name and avatar for the given Ethereum address.
  const _useName = useName({
      address: accountAddress,
      chain: accountChain
    }),
    name = _useName.data,
    isLoadingName = _useName.isLoading;
  const _useAvatar = useAvatar({
      ensName: name ?? '',
      chain: accountChain
    }, {
      enabled: !!name
    }),
    avatar = _useAvatar.data,
    isLoadingAvatar = _useAvatar.isLoading;
  const badge = useMemo(() => {
    return Children.toArray(children).find(findComponent(Badge));
  }, [children]);
  const defaultAvatar = defaultComponent || defaultAvatarSVG;
  const loadingAvatar = loadingComponent || defaultLoadingSVG;

  // If the data is still loading, it displays a loading SVG.
  if (isLoadingName || isLoadingAvatar) {
    return /*#__PURE__*/jsx("div", {
      className: cn('h-8 w-8 overflow-hidden rounded-full', className),
      children: loadingAvatar
    });
  }
  const displayAvatarImg = name && avatar;

  // Otherwise, it displays the custom avatar obtained from ENS.
  return /*#__PURE__*/jsxs("div", {
    className: "relative",
    children: [/*#__PURE__*/jsx("div", {
      "data-testid": "ockAvatar_ImageContainer",
      className: cn('h-10 w-10 overflow-hidden rounded-full', className),
      children: displayAvatarImg ? /*#__PURE__*/jsx("img", _objectSpread({
        className: "min-h-full min-w-full object-cover",
        "data-testid": "ockAvatar_Image",
        loading: "lazy",
        width: "100%",
        height: "100%",
        decoding: "async",
        src: avatar,
        alt: name
      }, props)) : defaultAvatar
    }), badge && /*#__PURE__*/jsx(DisplayBadge, {
      address: accountAddress,
      children: /*#__PURE__*/jsx("div", {
        "data-testid": "ockAvatar_BadgeContainer",
        className: "-bottom-0.5 -right-0.5 absolute flex h-[15px] w-[15px] items-center justify-center rounded-full bg-transparent",
        children: /*#__PURE__*/jsx("div", {
          className: "flex h-3 w-3 items-center justify-center",
          children: badge
        })
      })
    })]
  });
}
export { Avatar };
//# sourceMappingURL=Avatar.js.map
