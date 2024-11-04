import '../../../identity/index.js';
import { cn, text, color } from '../../../styles/theme.js';
import { useOnchainKit } from '../../../useOnchainKit.js';
import { useNFTContext } from '../NFTProvider.js';
import { jsxs, jsx } from 'react/jsx-runtime';
import { Identity } from '../../../identity/components/Identity.js';
import { Avatar } from '../../../identity/components/Avatar.js';
import { Name } from '../../../identity/components/Name.js';
import { Badge } from '../../../identity/components/Badge.js';
function NFTOwner({
  className,
  label = 'Owned by'
}) {
  const _useOnchainKit = useOnchainKit(),
    schemaId = _useOnchainKit.schemaId;
  const _useNFTContext = useNFTContext(),
    ownerAddress = _useNFTContext.ownerAddress;
  if (!ownerAddress) {
    return null;
  }
  return /*#__PURE__*/jsxs("div", {
    className: cn('flex items-center justify-between', text.label2, className),
    children: [/*#__PURE__*/jsx("div", {
      className: cn(color.foregroundMuted),
      children: label
    }), /*#__PURE__*/jsxs(Identity, {
      className: cn('!bg-inherit space-x-1 px-0 [&>div]:space-x-2'),
      address: ownerAddress,
      schemaId: schemaId,
      children: [/*#__PURE__*/jsx(Avatar, {
        className: "h-4 w-4"
      }), /*#__PURE__*/jsx(Name, {
        children: /*#__PURE__*/jsx(Badge, {})
      })]
    })]
  });
}
export { NFTOwner };
//# sourceMappingURL=NFTOwner.js.map
