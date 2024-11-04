const _excluded = ["address", "className", "children", "chain"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var s = Object.getOwnPropertySymbols(e); for (r = 0; r < s.length; r++) o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
import { useMemo, Children } from 'react';
import { findComponent } from '../../internal/utils/findComponent.js';
import { cn, text, color } from '../../styles/theme.js';
import { useName } from '../hooks/useName.js';
import { getSlicedAddress } from '../utils/getSlicedAddress.js';
import { Badge } from './Badge.js';
import { DisplayBadge } from './DisplayBadge.js';
import { useIdentityContext } from './IdentityProvider.js';
import { jsx, jsxs } from 'react/jsx-runtime';
function Name(_ref) {
  let _ref$address = _ref.address,
    address = _ref$address === void 0 ? null : _ref$address,
    className = _ref.className,
    children = _ref.children,
    chain = _ref.chain,
    props = _objectWithoutProperties(_ref, _excluded);
  const _useIdentityContext = useIdentityContext(),
    contextAddress = _useIdentityContext.address,
    contextChain = _useIdentityContext.chain;
  if (!contextAddress && !address) {
    console.error('Name: an Ethereum address must be provided to the Identity or Name component.');
    return null;
  }
  const accountAddress = address ?? contextAddress;
  const accountChain = chain ?? contextChain;
  const _useName = useName({
      address: accountAddress,
      chain: accountChain
    }),
    name = _useName.data,
    isLoading = _useName.isLoading;
  const badge = useMemo(() => {
    return Children.toArray(children).find(findComponent(Badge));
  }, [children]);
  if (isLoading) {
    return /*#__PURE__*/jsx("span", {
      className: className
    });
  }
  return /*#__PURE__*/jsxs("div", {
    className: "flex items-center gap-1",
    children: [/*#__PURE__*/jsx("span", _objectSpread(_objectSpread({
      "data-testid": "ockIdentity_Text",
      className: cn(text.headline, color.foreground, className)
    }, props), {}, {
      children: name || getSlicedAddress(accountAddress)
    })), badge && /*#__PURE__*/jsx(DisplayBadge, {
      address: accountAddress,
      children: badge
    })]
  });
}
export { Name };
//# sourceMappingURL=Name.js.map
