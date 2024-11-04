import '../../../identity/index.js';
import { cn, text, color } from '../../../styles/theme.js';
import { useOnchainKit } from '../../../useOnchainKit.js';
import { useNFTContext } from '../NFTProvider.js';
import { jsxs, jsx } from 'react/jsx-runtime';
import { Identity } from '../../../identity/components/Identity.js';
import { Avatar } from '../../../identity/components/Avatar.js';
import { Name } from '../../../identity/components/Name.js';
function NFTMinters({
  className
}) {
  const _useOnchainKit = useOnchainKit(),
    schemaId = _useOnchainKit.schemaId;
  const _useNFTContext = useNFTContext(),
    totalOwners = _useNFTContext.totalOwners,
    recentOwners = _useNFTContext.recentOwners;
  if (!recentOwners || recentOwners.length === 0) {
    return null;
  }
  return /*#__PURE__*/jsxs("div", {
    className: cn(text.body, color.foregroundMuted, 'flex items-center py-0.5', className),
    children: [/*#__PURE__*/jsx("div", {
      className: "flex space-x-[-.8rem]",
      children: recentOwners.map(address => /*#__PURE__*/jsx(Identity, {
        className: "space-x-0 px-0 py-0 [&>div]:space-x-2",
        address: address,
        schemaId: schemaId,
        children: /*#__PURE__*/jsx(Avatar, {
          className: "h-4 w-4"
        })
      }, address))
    }), /*#__PURE__*/jsxs("div", {
      className: "flex",
      children: [/*#__PURE__*/jsx("div", {
        children: "Minted by"
      }), /*#__PURE__*/jsx(Identity, {
        className: "px-1 py-0 [&>div]:space-x-0",
        address: recentOwners[0],
        schemaId: schemaId,
        children: /*#__PURE__*/jsx(Name, {
          className: "max-w-[180px] overflow-hidden text-ellipsis"
        })
      }), totalOwners && /*#__PURE__*/jsxs("div", {
        children: ["and ", totalOwners, " others"]
      })]
    })]
  });
}
export { NFTMinters };
//# sourceMappingURL=NFTMinters.js.map
