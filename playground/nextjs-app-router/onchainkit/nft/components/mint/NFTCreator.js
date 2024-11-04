import '../../../identity/index.js';
import { cn } from '../../../styles/theme.js';
import { useOnchainKit } from '../../../useOnchainKit.js';
import { useNFTContext } from '../NFTProvider.js';
import { jsx, jsxs } from 'react/jsx-runtime';
import { Identity } from '../../../identity/components/Identity.js';
import { Avatar } from '../../../identity/components/Avatar.js';
import { Name } from '../../../identity/components/Name.js';
import { Badge } from '../../../identity/components/Badge.js';
function NFTCreator({
  className
}) {
  const _useOnchainKit = useOnchainKit(),
    schemaId = _useOnchainKit.schemaId;
  const _useNFTContext = useNFTContext(),
    creatorAddress = _useNFTContext.creatorAddress;
  if (!creatorAddress) {
    return null;
  }
  return /*#__PURE__*/jsx("div", {
    className: cn('flex justify-between pb-2', className),
    children: /*#__PURE__*/jsxs(Identity, {
      className: "px-0 [&>div]:space-x-2",
      address: creatorAddress,
      schemaId: schemaId,
      children: [/*#__PURE__*/jsx(Avatar, {
        className: "h-4 w-4"
      }), /*#__PURE__*/jsx(Name, {
        children: /*#__PURE__*/jsx(Badge, {})
      })]
    })
  });
}
export { NFTCreator };
//# sourceMappingURL=NFTCreator.js.map
