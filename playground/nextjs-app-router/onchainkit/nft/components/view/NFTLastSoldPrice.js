import { cn, text, color } from '../../../styles/theme.js';
import { formatAmount } from '../../../token/utils/formatAmount.js';
import { useNFTContext } from '../NFTProvider.js';
import { jsxs, jsx } from 'react/jsx-runtime';
function NFTLastSoldPrice({
  className,
  label = 'Mint price'
}) {
  const _useNFTContext = useNFTContext(),
    lastSoldPrice = _useNFTContext.lastSoldPrice;
  if (!lastSoldPrice?.amount || !lastSoldPrice?.currency || !lastSoldPrice?.amountUSD) {
    return null;
  }
  const amount = lastSoldPrice.amount,
    currency = lastSoldPrice.currency,
    amountUSD = lastSoldPrice.amountUSD;
  return /*#__PURE__*/jsxs("div", {
    className: cn('flex justify-between py-0.5', text.label2, className),
    children: [/*#__PURE__*/jsx("div", {
      className: cn(color.foregroundMuted),
      children: label
    }), /*#__PURE__*/jsxs("div", {
      className: "flex",
      children: [/*#__PURE__*/jsxs("div", {
        className: text.label1,
        children: [amount, " ", currency]
      }), /*#__PURE__*/jsx("div", {
        className: "px-2",
        children: "~"
      }), /*#__PURE__*/jsxs("div", {
        children: ["$", formatAmount(`${amountUSD}`, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })]
      })]
    })]
  });
}
export { NFTLastSoldPrice };
//# sourceMappingURL=NFTLastSoldPrice.js.map
