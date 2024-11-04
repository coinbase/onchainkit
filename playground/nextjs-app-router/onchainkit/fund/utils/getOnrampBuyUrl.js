const _excluded = ["projectId"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var s = Object.getOwnPropertySymbols(e); for (r = 0; r < s.length; r++) o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
import { version } from '../../version.js';
import { ONRAMP_BUY_URL } from '../constants.js';

/**
 * Builds a Coinbase Onramp buy URL using the provided parameters.
 * @param projectId a projectId generated in the Coinbase Developer Portal
 * @returns the URL
 */
function getOnrampBuyUrl(_ref) {
  let projectId = _ref.projectId,
    props = _objectWithoutProperties(_ref, _excluded);
  const url = new URL(ONRAMP_BUY_URL);
  if (projectId !== undefined) {
    // Coinbase Onramp requires projectId to be passed as appId
    url.searchParams.append('appId', projectId);
  }
  for (const key of Object.keys(props)) {
    const value = props[key];
    if (value !== undefined) {
      if (['string', 'number', 'boolean'].includes(typeof value)) {
        url.searchParams.append(key, value.toString());
      } else {
        url.searchParams.append(key, JSON.stringify(value));
      }
    }
  }
  url.searchParams.append('sdkVersion', `onchainkit@${version}`);
  url.searchParams.sort();
  return url.toString();
}
export { getOnrampBuyUrl };
//# sourceMappingURL=getOnrampBuyUrl.js.map
