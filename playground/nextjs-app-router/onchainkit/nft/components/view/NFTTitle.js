import { cn, text } from '../../../styles/theme.js';
import { useNFTContext } from '../NFTProvider.js';
import { jsx } from 'react/jsx-runtime';
function NFTTitle({
  className
}) {
  const _useNFTContext = useNFTContext(),
    name = _useNFTContext.name;
  if (!name) {
    return null;
  }
  return /*#__PURE__*/jsx("div", {
    className: cn('overflow-hidden text-ellipsis pt-3 pb-1', text.title3, className),
    children: name
  });
}
export { NFTTitle };
//# sourceMappingURL=NFTTitle.js.map
