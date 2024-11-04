function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Modify a standard frame request to include simulated values (e.g., indicate the viewer
 * follows the cast author) for development/debugging purposes.
 * @param request A standard frame request.
 * @param options An object containing values we will pretend are real for the purposes of debugging.
 * @returns
 */
function getMockFrameRequest(request, options) {
  return _objectSpread(_objectSpread({}, request), {}, {
    mockFrameData: {
      address: null,
      button: request.untrustedData.buttonIndex,
      following: !!options?.following,
      input: request.untrustedData.inputText,
      interactor: {
        fid: options?.interactor?.fid || 0,
        custody_address: options?.interactor?.custody_address || '0xnotarealaddress',
        verified_accounts: options?.interactor?.verified_accounts || [],
        verified_addresses: {
          eth_addresses: null,
          sol_addresses: null
        }
      },
      liked: !!options?.liked,
      recasted: !!options?.recasted,
      state: {
        serialized: request.untrustedData.state || ''
      },
      transaction: null,
      valid: true,
      raw: {
        valid: true,
        /* biome-ignore lint: code needs to be refactored */
        action: {}
      }
    }
  });
}
export { getMockFrameRequest };
//# sourceMappingURL=getMockFrameRequest.js.map
