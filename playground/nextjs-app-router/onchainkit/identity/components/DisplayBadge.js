import { useOnchainKit } from '../../useOnchainKit.js';
import { useAttestations } from '../hooks/useAttestations.js';
import { useIdentityContext } from './IdentityProvider.js';
function DisplayBadge({
  children,
  address
}) {
  const _useOnchainKit = useOnchainKit(),
    chain = _useOnchainKit.chain,
    schemaId = _useOnchainKit.schemaId;
  const _useIdentityContext = useIdentityContext(),
    contextSchemaId = _useIdentityContext.schemaId,
    contextAddress = _useIdentityContext.address;
  if (!contextSchemaId && !schemaId) {
    throw new Error('Name: a SchemaId must be provided to the OnchainKitProvider or Identity component.');
  }
  const attestations = useAttestations({
    address: address ?? contextAddress,
    chain: chain,
    schemaId: contextSchemaId ?? schemaId
  });
  if (attestations.length === 0) {
    return null;
  }
  return children;
}
export { DisplayBadge };
//# sourceMappingURL=DisplayBadge.js.map
