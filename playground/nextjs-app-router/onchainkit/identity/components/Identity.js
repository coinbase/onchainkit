import { useOnchainKit } from '../../useOnchainKit.js';
import { IdentityLayout } from './IdentityLayout.js';
import { IdentityProvider } from './IdentityProvider.js';
import { jsx } from 'react/jsx-runtime';
function Identity({
  address,
  chain,
  children,
  className,
  hasCopyAddressOnClick,
  schemaId
}) {
  const _useOnchainKit = useOnchainKit(),
    contextChain = _useOnchainKit.chain;
  const accountChain = chain ?? contextChain;
  return /*#__PURE__*/jsx(IdentityProvider, {
    address: address,
    schemaId: schemaId,
    chain: accountChain,
    children: /*#__PURE__*/jsx(IdentityLayout, {
      className: className,
      hasCopyAddressOnClick: hasCopyAddressOnClick,
      children: children
    })
  });
}
export { Identity };
//# sourceMappingURL=Identity.js.map
