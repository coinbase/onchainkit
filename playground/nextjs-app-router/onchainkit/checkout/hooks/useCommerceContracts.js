function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import { useCallback } from 'react';
import { formatUnits } from 'viem';
import { useConfig } from 'wagmi';
import { getCommerceContracts } from '../utils/getCommerceContracts.js';
import { getUSDCBalance } from '../utils/getUSDCBalance.js';
import { handlePayRequest } from '../utils/handlePayRequest.js';
const useCommerceContracts = ({
  chargeHandler,
  productId
}) => {
  const config = useConfig();
  return useCallback(async address => {
    try {
      // Make the Pay request to the appropriate endpoint
      // `productId` to create and hydrate a charge for a product (serverless)
      // `chargeHandler` for a developer-provided callback used to return a charge ID (e.g. from the merchant backend)
      const _await$Promise$all = await Promise.all([handlePayRequest({
          address,
          chargeHandler,
          productId
        }), getUSDCBalance({
          address,
          config
        })]),
        _await$Promise$all2 = _slicedToArray(_await$Promise$all, 2),
        response = _await$Promise$all2[0],
        usdcBalance = _await$Promise$all2[1];

      // Set the `chargeId`
      const chargeId = response.id;

      // Retrieve commerce contracts from response
      const contracts = getCommerceContracts({
        transaction: response
      });

      // Calculate user's USDC balance
      const priceInUSDC = formatUnits(BigInt(response.callData.feeAmount) + BigInt(response.callData.recipientAmount), 6);

      // Set insufficient balance flag, if applicable
      const insufficientBalance = Number.parseFloat(usdcBalance) < Number.parseFloat(priceInUSDC);
      return {
        chargeId,
        contracts,
        insufficientBalance,
        priceInUSDC
      };
    } catch (error) {
      console.error('Unexpected error fetching contracts:', error);
      return {
        chargeId: '',
        contracts: null,
        insufficientBalance: false,
        error
      };
    }
  }, [config, chargeHandler, productId]);
};
export { useCommerceContracts };
//# sourceMappingURL=useCommerceContracts.js.map
