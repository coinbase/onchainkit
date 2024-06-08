import { useOnchainKit } from '../../useOnchainKit';
import { useAttestations } from '../hooks/useAttestations';
import { Badge } from './Badge';
import type { WithNameBadgeInnerReact, WithNameBadgeReact } from '../types';

const ERROR_MESSAGE =
  'EAS schemaId must provided in OnchainKitProvider context when using WithNameBadge showAttestation is true.';

function WithNameBadgeInner({ children, address }: WithNameBadgeInnerReact) {
  const onchainKitContext = useOnchainKit();
  // SchemaId is required to fetch attestations
  if (!onchainKitContext?.schemaId) {
    console.error(ERROR_MESSAGE);
    return children;
  }
  const attestations = useAttestations({
    address,
    chain: onchainKitContext?.chain,
    schemaId: onchainKitContext?.schemaId,
  });
  return (
    <div className="ock-withnamebadge-container" data-testid="ockNameBadgeContainer">
      {children}
      {attestations && attestations[0] && (
        <div className="ock-withnamebadge-inner">
          <Badge />
        </div>
      )}
    </div>
  );
}

export function WithNameBadge({ children, showAttestation, address }: WithNameBadgeReact) {
  if (!showAttestation) {
    return children;
  }
  return <WithNameBadgeInner address={address}>{children}</WithNameBadgeInner>;
}
