import { createContext, useContext } from 'react';
import { useValue } from '../../internal/hooks/useValue.js';
import { useOnchainKit } from '../../useOnchainKit.js';
import { jsx } from 'react/jsx-runtime';
const emptyContext = {};
const IdentityContext = /*#__PURE__*/createContext(emptyContext);
function useIdentityContext() {
  return useContext(IdentityContext);
}
function IdentityProvider(props) {
  const _useOnchainKit = useOnchainKit(),
    contextChain = _useOnchainKit.chain;
  const accountChain = props.chain ?? contextChain;
  const value = useValue({
    address: props.address || '',
    chain: accountChain,
    schemaId: props.schemaId
  });
  return /*#__PURE__*/jsx(IdentityContext.Provider, {
    value: value,
    children: props.children
  });
}
export { IdentityContext, IdentityProvider, useIdentityContext };
//# sourceMappingURL=IdentityProvider.js.map
