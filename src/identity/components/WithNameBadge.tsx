import { Badge } from './Badge';
import { useOnchainKit } from '../../useOnchainKit';
import { useAttestations } from '../hooks/useAttestations';
import { useIdentityContext } from '../context';
import type { WithNameBadgeInnerReact, WithNameBadgeReact } from '../types';

function WithNameBadgeInner({ children, address }: WithNameBadgeInnerReact) {
  const { chain, schemaId } = useOnchainKit();
  const { schemaId: contextSchemaId } = useIdentityContext();
  if (!contextSchemaId && !schemaId) {
    throw new Error(
      'Name: a SchemaId must be provided to the Identity or Avatar component.',
    );
  }

  const attestations = useAttestations({
    address,
    chain: chain,
    schemaId: contextSchemaId ?? schemaId,
  });
  return (
    <div className="flex items-center" data-testid="ockNameBadgeContainer">
      {children}
      {attestations?.[0] && (
        <div className="ml-1">
          <Badge />
        </div>
      )}
    </div>
  );
}

export function WithNameBadge({
  children,
  showAttestation,
  address,
}: WithNameBadgeReact) {
  if (!showAttestation) {
    return children;
  }
  return <WithNameBadgeInner address={address}>{children}</WithNameBadgeInner>;
}
