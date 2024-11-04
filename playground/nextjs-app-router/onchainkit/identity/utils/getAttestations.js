function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { getAttestationsByFilter } from '../../network/attestations.js';
import { isChainSupported } from './easSupportedChains.js';

/**
 * Fetches Ethereum Attestation Service (EAS) attestations for a given address and chain,
 * optionally filtered by schemas associated with the attestation.
 */
async function getAttestations(address, chain, options) {
  if (!isChainSupported(chain)) {
    console.log('Error in getAttestation: Chain is not supported');
    return [];
  }
  try {
    // Default query filter values
    const defaultQueryVariablesFilter = {
      revoked: false,
      expirationTime: Math.round(Date.now() / 1000),
      limit: 10
    };
    const queryVariablesFilter = _objectSpread(_objectSpread({}, defaultQueryVariablesFilter), options);
    return await getAttestationsByFilter(address, chain, queryVariablesFilter);
  } catch (error) {
    console.log(`Error in getAttestation: ${error.message}`);
    return [];
  }
}
export { getAttestations };
//# sourceMappingURL=getAttestations.js.map
