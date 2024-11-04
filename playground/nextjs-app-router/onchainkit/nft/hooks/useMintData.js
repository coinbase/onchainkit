function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useNFTLifecycleContext } from '../components/NFTLifecycleProvider.js';
import { convertIpfsToHttps } from '../utils/ipfs.js';
import { useMintDetails } from './useMintDetails.js';
function useMintData(contractAddress, tokenId) {
  const _useNFTLifecycleConte = useNFTLifecycleContext(),
    updateLifecycleStatus = _useNFTLifecycleConte.updateLifecycleStatus;
  const _useState = useState(null),
    _useState2 = _slicedToArray(_useState, 2),
    error = _useState2[0],
    setError = _useState2[1];
  const _useAccount = useAccount(),
    address = _useAccount.address;
  useEffect(() => {
    if (error) {
      updateLifecycleStatus({
        statusName: 'error',
        statusData: error
      });
    }
  }, [error, updateLifecycleStatus]);
  const _useMintDetails = useMintDetails(_objectSpread({
      contractAddress,
      takerAddress: address
    }, tokenId ? {
      tokenId
    } : {})),
    mintError = _useMintDetails.error,
    mintData = _useMintDetails.data;
  if (mintError && !error) {
    setError({
      code: 'NmMD01',
      message: mintError.message,
      error: 'Error fetching mint data'
    });
    return mintError;
  }
  return {
    name: mintData?.name,
    description: mintData?.description,
    imageUrl: convertIpfsToHttps(mintData?.imageUrl),
    animationUrl: convertIpfsToHttps(mintData?.animationUrl),
    mimeType: mintData?.mimeType,
    contractType: mintData?.contractType,
    maxMintsPerWallet: mintData?.maxMintsPerWallet === 0 ? undefined : mintData?.maxMintsPerWallet,
    price: mintData?.price,
    mintFee: mintData?.mintFee,
    isEligibleToMint: mintData?.isEligibleToMint,
    creatorAddress: mintData?.creatorAddress,
    totalOwners: mintData?.totalOwners,
    network: mintData?.network
  };
}
export { useMintData };
//# sourceMappingURL=useMintData.js.map
