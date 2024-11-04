import { QuantitySelector } from '../../../internal/components/QuantitySelector.js';
import { cn } from '../../../styles/theme.js';
import { useNFTContext } from '../NFTProvider.js';
import { jsx } from 'react/jsx-runtime';
function NFTQuantitySelector({
  className
}) {
  const _useNFTContext = useNFTContext(),
    maxMintsPerWallet = _useNFTContext.maxMintsPerWallet,
    setQuantity = _useNFTContext.setQuantity;

  // if max is 1, no need to show quantity selector
  if (maxMintsPerWallet === 1) {
    return null;
  }
  return /*#__PURE__*/jsx("div", {
    className: cn('py-3', className),
    children: /*#__PURE__*/jsx(QuantitySelector, {
      className: className,
      onChange: setQuantity,
      minQuantity: 1,
      maxQuantity: maxMintsPerWallet,
      placeholder: ""
    })
  });
}
export { NFTQuantitySelector };
//# sourceMappingURL=NFTQuantitySelector.js.map
