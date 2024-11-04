import { multiplyFloats } from '../../../internal/utils/multiplyFloats.js';
import { cn, text } from '../../../styles/theme.js';
import { formatAmount } from '../../../token/utils/formatAmount.js';
import { useNFTContext } from '../NFTProvider.js';
import { jsx, jsxs } from 'react/jsx-runtime';
function NFTAssetCost({
  className
}) {
  const _useNFTContext = useNFTContext(),
    price = _useNFTContext.price,
    quantity = _useNFTContext.quantity;
  if (price?.amount === undefined || !price.currency || price.amountUSD === undefined) {
    return null;
  }
  if (Number(price?.amount) === 0) {
    return /*#__PURE__*/jsx("div", {
      className: cn('flex py-2', text.body, className),
      children: "Free"
    });
  }
  return /*#__PURE__*/jsxs("div", {
    className: cn('flex py-2', text.body, className),
    children: [/*#__PURE__*/jsxs("div", {
      className: text.headline,
      children: [multiplyFloats(Number(price.amount), quantity), " ", price.currency]
    }), /*#__PURE__*/jsx("div", {
      className: "px-2",
      children: "~"
    }), /*#__PURE__*/jsxs("div", {
      children: ["$", formatAmount(`${multiplyFloats(Number(price.amountUSD), quantity)}`, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })]
    })]
  });
}
export { NFTAssetCost };
//# sourceMappingURL=NFTAssetCost.js.map
